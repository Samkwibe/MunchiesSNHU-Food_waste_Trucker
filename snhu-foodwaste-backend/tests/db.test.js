const mongoose = require('mongoose');
const connectDB = require('../config/db');

jest.mock('mongoose', () => ({
  connect: jest.fn()
}));

describe('connectDB', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should connect to MongoDB successfully when valid MONGODB_URI is provided', async () => {
    const connectSpy = jest.spyOn(mongoose, 'connect').mockResolvedValueOnce();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    process.env.MONGODB_URI = 'mongodb://validuri';
    await connectDB();

    expect(connectSpy).toHaveBeenCalledWith('mongodb://validuri');
    expect(consoleSpy).toHaveBeenCalledWith('✅ MongoDB connected successfully');
  });

  it('should exit process when MongoDB connection fails', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(mongoose, 'connect').mockRejectedValueOnce(new Error('Invalid URI'));

    delete process.env.MONGODB_URI;
    delete process.env.MONGO_URI;
    await expect(connectDB()).rejects.toThrow('process.exit');

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
