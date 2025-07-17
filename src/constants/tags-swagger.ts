import { ITagsSwagger } from '../types';

const DEFINE_TAGS_NAME = {
  AUTH: 'Auth',
  UPLOAD: 'Upload',
  HEALTH: 'Health',
  USER: 'User',
};

const DEFINE_TAGS: ITagsSwagger[] = [
  {
    name: DEFINE_TAGS_NAME.AUTH,
    description: 'List endpoints related to authentication and user management',
  },
  {
    name: DEFINE_TAGS_NAME.UPLOAD,
    description: 'Endpoints for file upload and management',
  },
  {
    name: DEFINE_TAGS_NAME.HEALTH,
    description: 'Endpoints to check the health of the application',
  },
  {
    name: DEFINE_TAGS_NAME.USER,
    description:
      'Endpoints for user management, including profile updates and user retrieval',
  },
];

export { DEFINE_TAGS, DEFINE_TAGS_NAME };
