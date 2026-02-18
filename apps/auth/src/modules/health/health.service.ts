import { connectDB } from "@auth/database/auth.connection";

export class HealthService {
  async check(): Promise<boolean> {
    await connectDB();
    return true;
  }
}
