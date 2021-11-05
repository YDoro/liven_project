export default {
    mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/liven',
    port: process.env.PORT || 3000
}