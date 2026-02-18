// Use NEXT_PUBLIC_ prefix for client-side access
export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://127.0.0.1:8787';

export const API_ENDPOINTS = {
    // userProfile Endpoints 
    createProfile: `${API_BASE_URL}/profiles`, // Creating a new user profile
    getAllProfiles: `${API_BASE_URL}/profiles`, // Fetching all userProfiles
    getProfileByUUID: (uuid: string) => `${API_BASE_URL}/profiles/${uuid}`, // Fetching a specific userProfile by uuid
    updateProfileByUUID: (uuid: string) => `${API_BASE_URL}/profiles/${uuid}`, // Updating a specific userProfile by uuid

}