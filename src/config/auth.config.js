module.exports = {
    secret: "some-secret-key",
    // jwtExpiration: 60,          // 1 minute
    // jwtRefreshExpiration: 120,  // 2 minutes
    jwtExpiration: 10800,          // 1 minute
    jwtRefreshExpiration: 21600,  // 2 minutes
};