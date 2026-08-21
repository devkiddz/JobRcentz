'use client';

import { BriefcaseBusiness, FileText, MapPin, UserRound } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type CandidateDetailsProps = {
  candidateName: string;
  profileImage?: string | null;
  jobTitle: string;
  location: string;
  applicationId: string;
};

type CandidateDetailsContentProps = Omit<CandidateDetailsProps, 'applicationId'>;

function DetailsContent({ candidateName, profileImage, jobTitle, location }: CandidateDetailsContentProps) {
  return (
    <div className="space-y-5 p-4">
      {/* Candidate */}
      <div className="flex items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
          {profileImage ? (
            <img src={profileImage} alt={candidateName} className="size-full object-cover" />
          ) : (
            <UserRound className="size-5 text-muted-foreground" />
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{candidateName}</p>

          <p className="text-xs text-muted-foreground">Candidate</p>
        </div>
      </div>

      <Separator />

      {/* Application */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BriefcaseBusiness className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Position</p>

            <p className="mt-0.5 text-sm font-medium">{jobTitle}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MapPin className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Job location</p>

            <p className="mt-0.5 text-sm font-medium">{location}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Context */}
      <div className="rounded-xl border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <FileText className="mt-0.5 size-4 shrink-0 text-primary" />

          <div>
            <p className="text-sm font-medium">Application context</p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Review the candidate&apos;s application before scheduling the interview.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Desktop candidate details sidebar.
 */
export default function CandidateDetails({
  candidateName,
  profileImage,
  jobTitle,
  location
}: CandidateDetailsProps) {
  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="border-b bg-muted/20">
        <CardTitle className="text-sm">Candidate details</CardTitle>
      </CardHeader>

      <CardContent className="p-5">
        <DetailsContent
          candidateName={candidateName}
          profileImage={profileImage}
          jobTitle={jobTitle}
          location={location}
        />
      </CardContent>
    </Card>
  );
}

/**
 * Mobile candidate details trigger + sheet.
 *
 * Kept as a separate named component instead of
 * CandidateDetails.MobileTrigger.
 */
export function CandidateDetailsMobileTrigger({
  candidateName,
  profileImage,
  jobTitle,
  location
}: CandidateDetailsContentProps) {
  return (
    <Sheet>
      <SheetTrigger
        type="button"
        className="group flex h-auto w-full items-center justify-between gap-4 rounded-xl border bg-card p-4 text-left shadow-sm transition-colors hover:bg-muted/40">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
            {profileImage ? (
              <img src={profileImage} alt={candidateName} className="size-full object-cover" />
            ) : (
              <UserRound className="size-5 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold">{candidateName}</p>

              <span className="hidden shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary sm:inline-flex">
                Candidate
              </span>
            </div>

            <p className="mt-0.5 truncate text-xs text-muted-foreground">{jobTitle}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
            Application details
          </span>

          <span className="flex size-8 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors group-hover:text-foreground">
            <UserRound className="size-4" />
          </span>
        </div>
      </SheetTrigger>

      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Candidate details</SheetTitle>

          <SheetDescription>Application and candidate information.</SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <DetailsContent
            candidateName={candidateName}
            profileImage={profileImage}
            jobTitle={jobTitle}
            location={location}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
