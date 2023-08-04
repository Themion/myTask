import { JwtModule } from '@nestjs/jwt';

const mockJwtModule = async () =>
  JwtModule.register({
    global: true,
    publicKey: 'publicKey',
    privateKey: 'privateKey',
  });

export default mockJwtModule;
