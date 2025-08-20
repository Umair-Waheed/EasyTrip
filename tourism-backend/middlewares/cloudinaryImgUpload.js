import { cloudinary } from "../utils/cloudinary.js";
const hotelImage = async (req, res, next) => {
  try {
    // Upload new roomImage files
    const uploadPromises = req.files.map(file =>
      cloudinary.uploader.upload(file.path, {
        folder: 'hotel',
        public_id: `hotel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        resource_type: 'image'
      })
    );

    const results = await Promise.allSettled(uploadPromises);

    const successfulUploads = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value.secure_url);

    req.uploadedImages = successfulUploads;

    // Function to extract public ID from URL
    const extractPublicId = (url) => {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      const folder = parts[parts.length - 2];
      const [publicFileName] = filename.split('.');
      return `${folder}/${publicFileName}`;
    };

    // Handle deletion of old images
    let toDelete = req.body.imagesToDelete;

    if (toDelete) {
      if (typeof toDelete === 'string') {
        toDelete = [toDelete]; // Convert single string to array
      }

      const publicIds = toDelete.map(extractPublicId);

      const deleteResults = await Promise.allSettled(
        publicIds.map(publicId => cloudinary.uploader.destroy(publicId))
      );

      const failedDeletes = deleteResults
        .filter(r => r.status === 'rejected')
        .map((r, i) => ({
          publicId: publicIds[i],
          error: r.reason.message,
        }));

      if (failedDeletes.length > 0) {
        req.failedDeletes = failedDeletes;
      }
    }

    next();
  } catch (err) {
    console.error("Error in hotelImage middleware:", err);
    res.status(500).json({ success: false, message: "Image processing failed" });
  }
};
const transportImage = async (req, res, next) => {
  try {
    // Upload new roomImage files
    const uploadPromises = req.files.map(file =>
      cloudinary.uploader.upload(file.path, {
        folder: 'transport',
        public_id: `transport-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        resource_type: 'image'
      })
    );

    const results = await Promise.allSettled(uploadPromises);

    const successfulUploads = results
      .filter(r => r.status === 'fulfilled')
      .map(r => ({
              url: r.value.secure_url,
              filename: r.value.public_id
            }))
    req.uploadedImages = successfulUploads;
console.log("new uplaoded image"+ successfulUploads);
    // Function to extract public ID from URL
    const extractPublicId = (url) => {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      const folder = parts[parts.length - 2];
      const [publicFileName] = filename.split('.');
      return `${folder}/${publicFileName}`;
    };

    // Handle deletion of old images
    let toDelete = req.body.imagesToDelete;
console.log("delete"+ successfulUploads);

    if (toDelete) {
      if (typeof toDelete === 'string') {
        toDelete = [toDelete]; // Convert single string to array
      }

      const publicIds = toDelete.map(extractPublicId);
      console.log(publicIds);
      const deleteResults = await Promise.allSettled(
        publicIds.map(publicId => cloudinary.uploader.destroy(publicId))
      );
      console.log(deleteResults);

      const failedDeletes = deleteResults
        .filter(r => r.status === 'rejected')
        .map((r, i) => ({
          publicId: publicIds[i],
          error: r.reason.message,
        }));

      if (failedDeletes.length > 0) {
        req.failedDeletes = failedDeletes;
      }
    }

    next();
  } catch (err) {
    console.error("Error in tansport Image middleware:", err);
    res.json({ success: false, message: "Image processing failed" });
  }
};
const guideImage = async (req, res, next) => {
  try {
    // Upload new roomImage files
    const uploadPromises = req.files.map(file =>
      cloudinary.uploader.upload(file.path, {
        folder: 'guide',
        public_id: `guide-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        resource_type: 'image'
      })
    );

    const results = await Promise.allSettled(uploadPromises);

    const successfulUploads = results
      .filter(r => r.status === 'fulfilled')
      .map(r => ({
              url: r.value.secure_url,
              filename: r.value.public_id
            }))
    req.uploadedImages = successfulUploads;
console.log("new uplaoded image"+ successfulUploads);
    // Function to extract public ID from URL
    const extractPublicId = (url) => {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      const folder = parts[parts.length - 2];
      const [publicFileName] = filename.split('.');
      return `${folder}/${publicFileName}`;
    };

    // Handle deletion of old images
    let toDelete = req.body.imagesToDelete;
console.log("delete"+ successfulUploads);

    if (toDelete) {
      if (typeof toDelete === 'string') {
        toDelete = [toDelete]; // Convert single string to array
      }

      const publicIds = toDelete.map(extractPublicId);
      console.log(publicIds);
      const deleteResults = await Promise.allSettled(
        publicIds.map(publicId => cloudinary.uploader.destroy(publicId))
      );
      console.log(deleteResults);

      const failedDeletes = deleteResults
        .filter(r => r.status === 'rejected')
        .map((r, i) => ({
          publicId: publicIds[i],
          error: r.reason.message,
        }));

      if (failedDeletes.length > 0) {
        req.failedDeletes = failedDeletes;
      }
    }

    next();
  } catch (err) {
    console.error("Error in tansport Image middleware:", err);
    res.json({ success: false, message: "Image processing failed" });
  }
};
// const uploadProviderImages = async (files, providerType) => {
//   try {
//     const uploadedImages = {};

//     // Loop through each field (e.g., governmentId, profile, certificate, etc.)
//     for (const field in files) {
//       const file = files[field][0]; // single file per field

//       const result = await cloudinary.uploader.upload(file.path, {
//         folder: `${providerType}`,
//         public_id: `${providerType}-${field}-${Date.now()}-${Math.random()
//           .toString(36)
//           .slice(2, 8)}`,
//         resource_type: "image",
//       });

//       uploadedImages[field] = {
//         url: result.secure_url,
//         filename: result.public_id, // needed if you want to delete later
//       };
//     }

//     return uploadedImages;
//   } catch (error) {
//     console.error("Error uploading provider images:", error);
//     throw new Error("Image upload failed");
//   }
// };

const providerImageUpload = async (req, res, next) => {
  try {
    if (!req.files) return next();

    req.uploadedImages = {};

    const fileFields = ["image", "governmentId", "guideCertificate", "driverLicense", "hotelLicense"];

    for (const field of fileFields) {
      if (req.files[field]) {
        const file = req.files[field][0]; // single file
        const result = await cloudinary.uploader.upload(file.path, {
          folder: `providers/${field}`,
        });

        req.uploadedImages[field] = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }
    }

    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({ success: false, message: "Image upload failed", error: error.message });
  }
};

export {hotelImage,transportImage,guideImage,providerImageUpload}