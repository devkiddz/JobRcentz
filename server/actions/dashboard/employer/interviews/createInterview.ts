'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

type CreateInterviewResult = {
  success: boolean;
  error?: string;
  interviewId?: string;
};

/**
 * Converts a datetime-local value such as:
 *
 * 2026-08-25T10:00
 *
 * into the correct UTC Date for the supplied IANA timezone.
 *
 * This matters because Vercel/Node commonly runs in UTC while
 * the employer may be scheduling in Africa/Lagos.
 */
function zonedDateTimeToUtc(
  value: string,
  timeZone: string
): Date | null {
  if (!value || !timeZone) {
    return null;
  }

  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/
  );

  if (!match) {
    return null;
  }

  const [, year, month, day, hour, minute] = match;

  const naiveUtc = new Date(
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute)
    )
  );

  if (Number.isNaN(naiveUtc.getTime())) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  });

  const parts = formatter.formatToParts(naiveUtc);

  const values = Object.fromEntries(
    parts
      .filter(part => part.type !== 'literal')
      .map(part => [part.type, part.value])
  );

  const representedUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute)
  );

  const offset = representedUtc - naiveUtc.getTime();

  return new Date(naiveUtc.getTime() - offset);
}

function getInterviewTitle(
  title: FormDataEntryValue | null,
  candidateName: string,
  jobTitle: string
) {
  if (typeof title === 'string' && title.trim()) {
    return title.trim();
  }

  return `Interview with ${candidateName} — ${jobTitle}`;
}

export async function createInterview(
  _previousState: CreateInterviewResult,
  formData: FormData
): Promise<CreateInterviewResult> {
  const user = await requireAuth();

  const applicationId = formData.get('applicationId');
  const title = formData.get('title');
  const type = formData.get('type');
  const scheduledAt = formData.get('scheduledAt');
  const timezone = formData.get('timezone');
  const duration = formData.get('durationMinutes');
  const description = formData.get('description');
  const provider = formData.get('meetingProvider');
  const meetingUrl = formData.get('meetingUrl');
  const meetingId = formData.get('meetingId');
  const meetingPasscode = formData.get('meetingPasscode');
  const location = formData.get('location');

  if (
    typeof applicationId !== 'string' ||
    !applicationId.trim()
  ) {
    return {
      success: false,
      error: 'Application is required.'
    };
  }

  if (
    typeof scheduledAt !== 'string' ||
    !scheduledAt.trim()
  ) {
    return {
      success: false,
      error: 'Interview date and time are required.'
    };
  }

  if (
    typeof timezone !== 'string' ||
    !timezone.trim()
  ) {
    return {
      success: false,
      error: 'Interview timezone is required.'
    };
  }

  const interviewType =
    typeof type === 'string' && type
      ? type
      : 'ONLINE';

  if (!['IN_PERSON', 'ONLINE', 'AI'].includes(interviewType)) {
    return {
      success: false,
      error: 'Invalid interview type.'
    };
  }

  const parsedDate = zonedDateTimeToUtc(
    scheduledAt,
    timezone
  );

  if (!parsedDate) {
    return {
      success: false,
      error: 'Invalid interview date or time.'
    };
  }

  if (parsedDate.getTime() <= Date.now()) {
    return {
      success: false,
      error: 'The interview must be scheduled for a future date and time.'
    };
  }

  let durationMinutes: number | null = null;

  if (
    typeof duration === 'string' &&
    duration.trim()
  ) {
    const parsedDuration = Number(duration);

    if (
      !Number.isInteger(parsedDuration) ||
      parsedDuration <= 0 ||
      parsedDuration > 480
    ) {
      return {
        success: false,
        error: 'Interview duration must be between 1 and 480 minutes.'
      };
    }

    durationMinutes = parsedDuration;
  }

  const providerValue =
    typeof provider === 'string' && provider
      ? provider
      : null;

  if (
    providerValue &&
    ![
      'INTERNAL',
      'ZOOM',
      'GOOGLE_MEET',
      'MICROSOFT_TEAMS',
      'OTHER'
    ].includes(providerValue)
  ) {
    return {
      success: false,
      error: 'Invalid meeting provider.'
    };
  }

  if (
    interviewType === 'ONLINE' &&
    !meetingUrl?.toString().trim()
  ) {
    return {
      success: false,
      error: 'A meeting URL is required for an online interview.'
    };
  }

  if (
    interviewType === 'IN_PERSON' &&
    !location?.toString().trim()
  ) {
    return {
      success: false,
      error: 'A location is required for an in-person interview.'
    };
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    select: {
      id: true,
      role: true,
      company: {
        select: {
          id: true,
          companyName: true
        }
      }
    }
  });

  if (!dbUser) {
    return {
      success: false,
      error: 'User account not found.'
    };
  }

  if (dbUser.role !== 'EMPLOYER') {
    return {
      success: false,
      error: 'Employer account required.'
    };
  }

  if (!dbUser.company) {
    return {
      success: false,
      error: 'Company profile not found.'
    };
  }

  /**
   * Ownership is established through:
   *
   * employer → company → job → application
   *
   * This prevents an employer from scheduling an interview
   * against another company's application.
   */
  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      job: {
        companyId: dbUser.company.id
      }
    },
    select: {
      id: true,
      status: true,
      applicantId: true,
      jobId: true,

      applicant: {
        select: {
          id: true,
          name: true
        }
      },

      job: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });

  if (!application) {
    return {
      success: false,
      error: 'Application not found or you are not authorized to schedule an interview for it.'
    };
  }

  if (
    ['REJECTED', 'WITHDRAWN'].includes(application.status)
  ) {
    return {
      success: false,
      error: 'An interview cannot be scheduled for this application.'
    };
  }

  /**
   * Prevent accidental duplicate active interviews for
   * the same application at the same scheduled time.
   */
  const existingInterview =
    await prisma.interview.findFirst({
      where: {
        applicationId: application.id,
        scheduledAt: parsedDate,
        status: {
          notIn: ['CANCELLED', 'NO_SHOW']
        }
      },
      select: {
        id: true
      }
    });

  if (existingInterview) {
    return {
      success: false,
      error: 'An interview is already scheduled for this application at this time.'
    };
  }

  const interviewTitle = getInterviewTitle(
    title,
    application.applicant.name,
    application.job.title
  );

  try {
    const interview = await prisma.$transaction(
      async tx => {
        const createdInterview =
          await tx.interview.create({
            data: {
              jobId: application.jobId,
              applicationId: application.id,

              employerId: dbUser.id,
              candidateId: application.applicantId,

              type: interviewType as
                | 'IN_PERSON'
                | 'ONLINE'
                | 'AI',

              status: 'SCHEDULED',
              outcome: 'PENDING',

              title: interviewTitle,

              description:
                typeof description === 'string' &&
                description.trim()
                  ? description.trim()
                  : null,

              scheduledAt: parsedDate,

              durationMinutes,

              timezone,

              meetingProvider:
                providerValue as
                  | 'INTERNAL'
                  | 'ZOOM'
                  | 'GOOGLE_MEET'
                  | 'MICROSOFT_TEAMS'
                  | 'OTHER'
                  | null,

              meetingUrl:
                typeof meetingUrl === 'string' &&
                meetingUrl.trim()
                  ? meetingUrl.trim()
                  : null,

              meetingId:
                typeof meetingId === 'string' &&
                meetingId.trim()
                  ? meetingId.trim()
                  : null,

              meetingPasscode:
                typeof meetingPasscode === 'string' &&
                meetingPasscode.trim()
                  ? meetingPasscode.trim()
                  : null,

              location:
                typeof location === 'string' &&
                location.trim()
                  ? location.trim()
                  : null
            }
          });

        await tx.interviewParticipant.createMany({
          data: [
            {
              interviewId: createdInterview.id,
              userId: dbUser.id,
              role: 'EMPLOYER'
            },
            {
              interviewId: createdInterview.id,
              userId: application.applicantId,
              role: 'CANDIDATE'
            }
          ]
        });

        await tx.interviewEvent.create({
          data: {
            interviewId: createdInterview.id,
            actorId: dbUser.id,
            type: 'CREATED'
          }
        });

        await tx.notification.create({
          data: {
            userId: application.applicantId,
            type: 'INTERVIEW',
            priority: 'HIGH',
            title: 'Interview scheduled',
            message: `${interviewTitle} has been scheduled for you.`,
            href: `/dashboard/interviews/${createdInterview.id}`
          }
        });

        /**
         * Scheduling an interview moves the application
         * into the interview stage.
         */
        if (
          !['HIRED', 'REJECTED', 'WITHDRAWN'].includes(
            application.status
          )
        ) {
          await tx.application.update({
            where: {
              id: application.id
            },
            data: {
              status: 'INTERVIEW'
            }
          });
        }

        return createdInterview;
      }
    );

    revalidatePath(
      `/dashboard/employer/applications/${application.id}`
    );

    revalidatePath(
      '/dashboard/employer/applications'
    );

    revalidatePath(
      '/dashboard/employer/interviews'
    );

    revalidatePath(
      `/dashboard/employer/interviews/${interview.id}`
    );

    return {
      success: true,
      interviewId: interview.id
    };
  } catch (error) {
    console.error(
      'Failed to create interview:',
      error
    );

    return {
      success: false,
      error:
        'Unable to schedule the interview. Please try again.'
    };
  }
}