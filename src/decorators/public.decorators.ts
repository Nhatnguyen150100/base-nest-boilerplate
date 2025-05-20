import { IS_PUBLIC_KEY } from '@/constants';
import { SetMetadata } from '@nestjs/common';

export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
