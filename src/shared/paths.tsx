export const root = '';

type PathData = {
  path: (...args: any) => string;
  staticPath: string;
};

type Paths =
  | 'login'
  | 'home'
  | 'room'
  | 'roomSelection'
  | 'admin'
  | 'adminCreate'
  | 'adminEdit'
  | 'adminArchive'
  | 'adminPreview';
export const paths: { [path in Paths]: PathData } = {
  login: {
    path: () => `${root}/`,
    staticPath: `${root}/`,
  },
  home: {
    path: () => `${root}/home`,
    staticPath: `${root}/home`,
  },
  room: {
    path: (roomId: string) => `${root}/room/${roomId}`,
    staticPath: `${root}/room/:roomId`,
  },
  roomSelection: {
    path: (roomId: string) => `${root}/room/${roomId}/selection`,
    staticPath: `${root}/room/:roomId/selection`,
  },
  admin: {
    path: (roomId: string) => `${root}/room/${roomId}/admin`,
    staticPath: `${root}/room/:roomId/admin`,
  },
  adminCreate: {
    path: (roomId: string) => `${root}/room/${roomId}/admin/create`,
    staticPath: `${root}/room/:roomId/admin/create`,
  },
  adminEdit: {
    path: (roomId: string, weekId: string) =>
      `${root}/room/${roomId}/admin/edit/${weekId}`,
    staticPath: `${root}/room/:roomId/admin/edit/:weekId`,
  },
  adminArchive: {
    path: (roomId: string) => `${root}/room/${roomId}/admin/archive`,
    staticPath: `${root}/room/:roomId/admin/archive`,
  },
  adminPreview: {
    path: (roomId: string, weekId: string) =>
      `${root}/room/${roomId}/admin/preview/${weekId}`,
    staticPath: `${root}/room/:roomId/admin/preview/:weekId`,
  },
};

type OldPaths =
  | 'login'
  | 'home'
  | 'selection'
  | 'admin'
  | 'adminNewWeek'
  | 'adminEditWeek'
  | 'adminArchive'
  | 'adminPreview';
export const oldPaths: { [path in OldPaths]: PathData } = {
  login: {
    path: () => `${root}/`,
    staticPath: `${root}/`,
  },
  home: {
    path: () => `${root}/home`,
    staticPath: `${root}/home`,
  },
  selection: {
    path: () => `${root}/selection`,
    staticPath: `${root}/selection`,
  },
  admin: {
    path: () => `${root}/admin`,
    staticPath: `${root}/admin`,
  },
  adminNewWeek: {
    path: () => `${root}/admin/newweek`,
    staticPath: `${root}/admin/newweek`,
  },
  adminEditWeek: {
    path: (weekId: string) => `${root}/admin/editweek/${weekId}`,
    staticPath: `${root}/admin/editweek/:weekId`,
  },
  adminArchive: {
    path: () => `${root}/admin/archive`,
    staticPath: `${root}/admin/archive`,
  },
  adminPreview: {
    path: (weekId: string) => `${root}/admin/preview/${weekId}`,
    staticPath: `${root}/admin/preview/:weekId`,
  },
};
