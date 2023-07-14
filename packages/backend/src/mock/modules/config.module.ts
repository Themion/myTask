import { ConfigModule } from '@nestjs/config';
import { validate } from '~/env';
const mockConfigModule = async () => ConfigModule.forFeature(() => validate(process.env));
export default mockConfigModule;
