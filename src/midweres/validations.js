import Joi from "joi";

export async function validaPool(req, res, next) {
  const validation = schemaPool.validate(req.body, {
    abortEarly: true,
  });

  if (validation.error) {
    return res.sendStatus(422);
  }

  next();
}

export async function validaChoices(req, res, next) {
  const validation = schemaChoice.validate(req.body, {
    abortEarly: true,
  });

  if (validation.error) {
    return res.sendStatus(422);
  }

  next();
}

const schemaPool = Joi.object().keys({
  title: Joi.string().min(1).required(),
  expireAt: Joi.any(),
});

const schemaChoice = Joi.object().keys({
  title: Joi.string().min(1).required(),
  poolId: Joi.any(),
});
