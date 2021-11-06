export default {
    mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/liven',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'a7dad9d60b461ddc9cee8cfb071f4f49'
}