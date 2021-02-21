const JWT = require('jsonwebtoken');
const ms = require('ms');

const _getExpiresAtDate = ({ expiresIn = '1h' }) => {
  const inMs = ms(expiresIn);
  return new Date(Date.now() + inMs);
};

/**
 * Generate token
 * @param {string} userId
 * @param {string} expiresIn
 * @param {string} [secret]
 * @returns {string}
 */
function _generateToken({
  userId,
  expiresIn = process.env.JWT_ACCESS_DURATION,
  secret = process.env.JWT_SECRET,
}) {
  const payload = {
    sub: userId,
  };

  return JWT.sign(payload, secret, { expiresIn });
}

/**
 * Verify token and return payload (or throw an error if it is not valid)
 * @param {string} token
 * @returns {Promise<Token>}
 */
async function verifyToken({ token }) {
  const payload = JWT.verify(token, process.env.JWT_SECRET);

  return payload;
}

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
async function generateAuthTokens({ user_id: userId }) {
  const jwtAccessDuration = process.env.JWT_ACCESS_DURATION;
  const jwtRefreshDuration = process.env.JWT_REFRESH_DURATION;
  console.log(userId);
  const accessToken = _generateToken({ userId });
  const refreshToken = _generateToken({
    userId,
    expiresIn: jwtRefreshDuration,
    secret: process.env.JWT_REFRESH_SECRET,
  });

  return {
    access: {
      token: accessToken,
      expires: _getExpiresAtDate({ expiresIn: jwtAccessDuration }),
    },
    refresh: {
      token: refreshToken,
      expires: _getExpiresAtDate({ expiresIn: jwtRefreshDuration }),
    },
  };
}

/**
 * Verify refresh token and return payload (or throw an error if it is not valid)
 * @param {string} token
 * @returns {Promise<Token>}
 */
async function verifyRefreshToken(req, res) {
  if (req.headers && req.headers.authorization) {
    const authorization = req.get('authorization');
    const token = authorization.split('Bearer ')[1];
    JWT.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decode) => {
      if (err) {
        return res.status(401).send({
          status_code: 401,
          status: false,
          message: 'Please authenticate',
          data: 'Authentication code not matching'
        });
      }
      const tokens = await generateAuthTokens({ user_id: decode.sub })
      return res.status(200).send({
        status_code: 200,
        status: true,
        message: 'Refreshed new token',
        data: { tokens }
      });
    });
  }
}
module.exports = {
  generateAuthTokens,
  verifyToken,
  verifyRefreshToken
};
