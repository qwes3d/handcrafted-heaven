export async function validate(body, schema) {
  try {
    await schema.validateAsync(body, { abortEarly: false });
  } catch (err) {
    throw new Error(err.details.map(d => d.message).join(", "));
  }
}
