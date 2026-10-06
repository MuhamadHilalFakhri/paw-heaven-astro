// Add only real clinic photos, current adoption records, and reviews shared with permission.
// Store photo files in public/images and use paths such as /images/clinic.webp.
export interface ClinicPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface PetProfile {
  name: string;
  species: "Cat" | "Dog";
  age: string;
  character: string;
  description: string;
  status: "Available" | "Reserved" | "Adopted";
  photo: ClinicPhoto;
}

export interface ClientReview {
  name: string;
  quote: string;
  permissionConfirmed: boolean;
}

export const clinicPhotos: ClinicPhoto[] = [];
export const adoptablePets: PetProfile[] = [];
export const clientReviews: ClientReview[] = [];
