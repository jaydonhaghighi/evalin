// utils/addToWaitlist.ts
interface WaitlistResponse {
    message: string;
    email?: string;
    duplicate?: boolean;
    error?: string;
  }
  
  export async function addToWaitlist(email: string): Promise<WaitlistResponse> {
    // Trim + lowercase locally too (optional but nice for instant feedback)
    const cleanEmail = email.trim().toLowerCase();
  
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address');
    }
  
    const response = await fetch(
      'https://us-central1-evalin-1d270.cloudfunctions.net/add_to_waitlist',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: cleanEmail }),
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
  
    return data;
  }