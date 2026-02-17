import ImageKit from "imagekit";
import dotenv from "dotenv";
dotenv.config();

if (
  !process.env.IMAGE_KIT_PUBLIC_KEY ||
  !process.env.IMAGE_KIT_PRIVATE_KEY ||
  !process.env.IMAGE_KIT_URL_ENDPOINT
) {
  console.error(
    "❌ Missing ImageKit credentials in .env file. Please add:"
  );
  console.error("   - IMAGE_KIT_PUBLIC_KEY");
  console.error("   - IMAGE_KIT_PRIVATE_KEY");
  console.error("   - IMAGE_KIT_URL_ENDPOINT");
  process.exit(1);
}

const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});

export default imagekit;