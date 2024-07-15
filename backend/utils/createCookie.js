const createCookie = (
  res,
  cookieName,
  cookieValue,
  expiry = 7 * 24 * 60 * 60 * 1000
) => res.cookie(cookieName, cookieValue, { httpOnly: true, maxAge: expiry });

module.exports = createCookie;
