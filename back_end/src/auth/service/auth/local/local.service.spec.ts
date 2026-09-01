import { Test, TestingModule } from '@nestjs/testing';
import { LocalService } from './local.service';
import { PrismaService } from '../../../../Prisma/prisma.service';
import { Token } from '../../../token/token';
import { GenerateHashService } from '../../../../utils/hash.utils';
import { RedisService } from '../../../../modules/redis/redis.service';
import { ResendService } from '../../../../modules/resend/resend.service';
import * as argon from 'argon2';

jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('passwordHashed'),
  verify: jest.fn().mockResolvedValue(true),
}));
const mockTransaction = {
  user: { create: jest.fn() }
}

const mockPrisma = {
  user: { findUnique: jest.fn() },
  $transaction: jest.fn().mockImplementation((cb) => cb(mockTransaction))
}
const mockToken = {
  issueToken: jest.fn()
}

const mockHash = { createHmacForOtpValue: jest.fn() }
const mockRedis = {
  getEmailOpt: jest.fn()
}
const mockMail = { sendOtp: jest.fn() }

describe('LocalService', () => {
  let service: LocalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: Token, useValue: mockToken },
        { provide: GenerateHashService, useValue: mockHash },
        { provide: RedisService, useValue: mockRedis },
        { provide: ResendService, useValue: mockMail }
      ],
    }).compile();

    service = module.get<LocalService>(LocalService);
    jest.clearAllMocks();
  });


  describe('SingUp API', () => {
    it('shoud success and return user and tokens', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockRedis.getEmailOpt.mockResolvedValue('otpHashed');
      mockHash.createHmacForOtpValue.mockReturnValue('otpHashed');
      const user = {
        id: 'uuid1',
        email: 'test@gmail.com',
        avataUrl: null,
        name: null
      }
      mockTransaction.user.create.mockResolvedValue(user);
      mockToken.issueToken.mockResolvedValue({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
      const result = await service.signUp({ email: 'Test@gmail.com', password: 'password123', inputotp: '123456' });
      expect(result).toEqual({
        user: user,
        tokens: { accessToken: 'accessToken', refreshToken: 'refreshToken' }
      })
    }),
      it('shoud throw bad request exception because email existed', async () => {
        mockPrisma.user.findUnique.mockResolvedValue({ id: 'existed' });
        await expect(service.signUp({ email: 'test@gmail.com', password: '123456', inputotp: '000000' })).rejects.toThrow('Email này đã được sử dụng, vui lòng thay đổi');
        expect(mockRedis.getEmailOpt).not.toHaveBeenCalled();
        expect(mockPrisma.$transaction).not.toHaveBeenCalled();
      }),
      it('Should throw bad request exception because verity otp is wrong', async () => {
        mockPrisma.user.findUnique.mockResolvedValue(null);
        mockRedis.getEmailOpt.mockReturnValue('exactOtp');
        mockHash.createHmacForOtpValue.mockReturnValue('wrongOtp');
        await expect(service.signUp({ email: 'Test@gmail.com', password: '123456', inputotp: '000000' })).rejects.toThrow('Sai mã xác thực OTP');
      }),
      it('Should throw an unauthorizedexception due to missing data', async () => {
        await expect(service.signUp(null as any)).rejects.toThrow('không đúng');
      });

  });

  describe('signIn API', () => {
    it('The Email address does not exists in db', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.SignIn({ email: 'test@gmail.com', password: '123456' })).rejects.toThrow('Tài khoản hoặc mật khẩu không đúng');
      expect(argon.verify).not.toHaveBeenCalled();
    });
    it('throw new UnauthorizedExepction due to password is incorrect', async () => {
      const user = {
        id: 'abc123',
        email: 'test@gmail.com',
        password: 'passwordHashed'
      }
      mockPrisma.user.findUnique.mockResolvedValue(user);
      (argon.verify as jest.Mock).mockResolvedValueOnce(false);
      await expect(service.SignIn({ email: 'test@gmail.com', password: '123456' })).rejects.toThrow('Tài khoản hoặc mật khẩu không đúng');
      expect(mockToken.issueToken).not.toHaveBeenCalled();
    });
    it('Should success and return data', async () => {
      const user = {
        id: 'abc123',
        email: 'test@gmail.com',
        password: 'passwordHashed'
      }
      mockPrisma.user.findUnique.mockResolvedValue(user);
      (argon.verify as jest.Mock).mockResolvedValueOnce(true);
      mockToken.issueToken({ accessToken: 'acc', refreshToken: 'ref' })
      await expect(service.SignIn({ email: 'test@gmail.com', password: '123456' })).toEqual(
        
      )
    });
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
