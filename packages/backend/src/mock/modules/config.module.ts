import { ConfigModule } from '@nestjs/config';
const mockConfigModule = async () => ConfigModule.forFeature(() => process.env);
export default mockConfigModule;
