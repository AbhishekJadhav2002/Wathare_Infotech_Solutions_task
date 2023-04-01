import mongoose from 'mongoose';
import server from './config/server.mjs';

server.listen(process.env.PORT || '3000', '0.0.0.0', () => {
  console.log('Server listening on port ', process.env.PORT || '3000')
})

process.on('uncaughtException', async err => {
  console.log('UNCAUGHT EXCEPTION!!! shutting down...')
  console.log(err.name, err)
  await mongoose.connection.close()
  process.exit(1)
})

process.on('unhandledRejection', async err => {
  console.log('UNHANDLED REJECTION!!!  shutting down ...')
  console.log(err.name, err)
  await mongoose.connection.close()
  process.exit(1)
})