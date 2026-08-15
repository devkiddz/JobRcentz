import React from 'react';
import { Avatar, AvatarImage } from '../ui/avatar';
import { AvatarFallback } from '../ui/avatar';

export default function UserAvatar() {
  return (
    <div>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
