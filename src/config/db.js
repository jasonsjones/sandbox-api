import mongoose from 'mongoose';

export default (config) => {
    console.log('setting up mongodb...');
    mongoose.Promise = global.Promise;
    mongoose.connect(config.dbUrl, { useMongoClient: true });
    let db = mongoose.connection;

    db.once('open', function () {
        console.log(`Connected to mongo container`);
    });

    db.on('error', console.error.bind(console, 'connection error'));
    db.on('disconnected', () => {
        console.log(`Mongoose disconnected`);
    });

    process.on('SIGINT', () => {
        db.close(() => {
            console.log('Mongoose default connection closed via app termination');
            process.exit(0);
        });
    });

    process.once('SIGUSR2', () => {
        db.close(() => {
            console.log('Mongoose default connection closed via nodemon restart');
            process.kill(process.pid, 'SIGUSR2');
        });
    });
    return db;
}
