import { Prisma } from '@prisma/client';

export const softDeleteMiddleware: Prisma.Middleware = async (params, next) => {
  // Ensure params.args.where is an object before spreading
  const where = params.args.where || {};
  // Ensure params.args.data is an object before spreading
  const data = params.args.data || {};

  if (params.action === 'findUnique' || params.action === 'findFirst') {
    params.args.where = {
      ...where,
      deletedAt: null,
    };
  }

  if (params.action === 'findMany') {
    params.args.where = {
      ...where,
      deletedAt: null,
    };
  }

  if (params.action === 'update') {
    params.args.where = {
      ...where,
      deletedAt: null,
    };
  }

  if (params.action === 'updateMany') {
    params.args.where = {
      ...where,
      deletedAt: null,
    };
  }

  if (params.action === 'delete') {
    params.action = 'update';
    params.args.data = {
      ...data,
      deletedAt: new Date(),
    };
  }

  if (params.action === 'deleteMany') {
    params.action = 'updateMany';
    params.args.data = {
      ...data,
      deletedAt: new Date(),
    };
  }

  return next(params);
};