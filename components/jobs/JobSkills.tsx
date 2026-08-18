type JobSkillsProps = {
  skills: string[];
  limit?: number;
};

export function JobSkills({ skills, limit = 5 }: JobSkillsProps) {
  if (!skills.length) {
    return null;
  }

  const visibleSkills = skills.slice(0, limit);
  const remaining = skills.length - visibleSkills.length;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visibleSkills.map(skill => (
        <span
          key={skill}
          className="rounded-md border bg-muted/40 px-2 py-1 text-[11px] font-medium text-muted-foreground">
          {skill}
        </span>
      ))}

      {remaining > 0 && (
        <span className="rounded-md border bg-muted/40 px-2 py-1 text-[11px] font-medium text-muted-foreground">
          +{remaining} more
        </span>
      )}
    </div>
  );
}
