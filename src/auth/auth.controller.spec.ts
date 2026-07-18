import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    refreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginDto = {
      username: 'testuser',
      password: 'testpass123'
    };

    const mockLoginResponse = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token'
    };

    it('should successfully login with valid credentials', async () => {
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should pass through any errors from the auth service', async () => {
      const errorMessage = 'Invalid credentials';
      mockAuthService.login.mockRejectedValue(new Error(errorMessage));

      await expect(controller.login(loginDto)).rejects.toThrow(errorMessage);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('should handle empty credentials', async () => {
      const emptyLoginDto = {
        username: '',
        password: ''
      };
      
      mockAuthService.login.mockResolvedValue(null);

      const result = await controller.login(emptyLoginDto);
      
      expect(authService.login).toHaveBeenCalledWith(emptyLoginDto);
      expect(result).toBeNull();
    });
  });

  describe('refreshToken', () => {
    const refreshTokenDto = {
      refresh_token: 'valid-refresh-token'
    };

    const mockRefreshResponse = {
      access_token: 'new-access-token'
    };

    it('should successfully refresh token with valid refresh token', async () => {
      mockAuthService.refreshToken.mockResolvedValue(mockRefreshResponse);

      const result = await controller.refreshToken(refreshTokenDto);

      expect(authService.refreshToken).toHaveBeenCalledWith(refreshTokenDto.refresh_token);
      expect(authService.refreshToken).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockRefreshResponse);
    });

    it('should handle invalid refresh token', async () => {
      const errorMessage = 'Invalid refresh token';
      mockAuthService.refreshToken.mockRejectedValue(new Error(errorMessage));

      await expect(controller.refreshToken(refreshTokenDto)).rejects.toThrow(errorMessage);
      expect(authService.refreshToken).toHaveBeenCalledWith(refreshTokenDto.refresh_token);
      expect(authService.refreshToken).toHaveBeenCalledTimes(1);
    });

    it('should handle empty refresh token', async () => {
      const emptyRefreshTokenDto = {
        refresh_token: ''
      };
      
      const errorMessage = 'Refresh token is required';
      mockAuthService.refreshToken.mockRejectedValue(new Error(errorMessage));

      await expect(controller.refreshToken(emptyRefreshTokenDto)).rejects.toThrow(errorMessage);
      expect(authService.refreshToken).toHaveBeenCalledWith(emptyRefreshTokenDto.refresh_token);
    });
  });
});