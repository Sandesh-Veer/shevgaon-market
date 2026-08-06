/**
 * Firebase Error Handling & Crash Prevention Utility
 * 
 * Wraps all Firebase Firestore, Auth, and Storage asynchronous calls in robust
 * try...catch blocks to prevent application crashes and provide user-friendly feedback.
 */

export interface FirebaseOperationResult<T> {
  data: T | null;
  error: Error | null;
  errorMessage: string | null;
  success: boolean;
}

/**
 * Maps standard Firebase error codes to clean, human-readable user error messages.
 */
export function parseFirebaseError(error: any): string {
  if (!error) return "एक अज्ञात त्रुटी आली. कृपया पुन्हा प्रयत्न करा. (Unknown error occurred)";

  const code = error?.code || "";
  const message = error?.message || String(error);

  // Firestore & General Network Errors
  if (code === "permission-denied" || message.includes("permission-denied")) {
    return "परवानगी नाकारली. तुमच्याकडे ही क्रिया करण्याची परवानगी नाही. (Permission Denied)";
  }
  if (code === "unavailable" || message.includes("unavailable") || message.includes("network")) {
    return "सर्व्हर किंवा नेटवर्क सध्या उपलब्ध नाही. कृपया तुमचे इंटरनेट तपासा. (Network Unavailable)";
  }
  if (code === "not-found" || message.includes("not-found")) {
    return "मागितलेली माहिती किंवा ऑब्जेक्ट सापडला नाही. (Data Not Found)";
  }
  if (code === "already-exists") {
    return "हा डेटा आधीपासूनच अस्तित्वात आहे. (Already Exists)";
  }
  if (code === "resource-exhausted") {
    return "सर्व्हर कोटा मर्यादा संपली आहे. कृपया थोड्या वेळाने प्रयत्न करा. (Resource Exhausted)";
  }
  if (code === "deadline-exceeded") {
    return "विनंतीची वेळ संपली. नेटवर्किंग गती कमी असू शकते. (Timeout)";
  }

  // Firebase Auth Errors
  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
    return "अवैध ईमेल किंवा पासवर्ड. कृपया माहिती तपासून पुन्हा टाका. (Invalid Login Credentials)";
  }
  if (code === "auth/email-already-in-use") {
    return "हा ईमेल आयडी आधीपासूनच नोंदणीकृत आहे. (Email Already Registered)";
  }
  if (code === "auth/weak-password") {
    return "संकेतशब्द खूप कमकुवत आहे. किमान ६ अक्षरे टाका. (Weak Password)";
  }
  if (code === "auth/too-many-requests") {
    return "खूप जास्त प्रयत्न केले. सुरक्षेसाठी खाते काही काळ ब्लॉक केले आहे. (Too Many Requests)";
  }

  // Storage Errors
  if (code === "storage/unauthorized") {
    return "फाइल अपलोड किंवा डाउनलोड करण्यासाठी परवानगी नाही. (Unauthorized Storage Access)";
  }
  if (code === "storage/canceled") {
    return "फाइल अपलोड रद्द केले गेले. (File Upload Cancelled)";
  }

  return message || "डेटा प्रक्रियेत त्रुटी आली. कृपया पुन्हा प्रयत्न करा.";
}

/**
 * Reusable wrapper to safely execute any Firebase operation without crashing the application.
 * 
 * @example
 * const { data, success, errorMessage } = await safeFirebaseCall(
 *   () => getDocs(collection(db, "businesses")),
 *   "व्यापारी डेटा लोड करता आला नाही."
 * );
 * if (!success) {
 *   alert(errorMessage);
 * }
 */
export async function safeFirebaseCall<T>(
  operation: () => Promise<T>,
  fallbackMessage = "डेटा लोड करताना त्रुटी आली. (Failed to process request)"
): Promise<FirebaseOperationResult<T>> {
  try {
    const data = await operation();
    return {
      data,
      error: null,
      errorMessage: null,
      success: true,
    };
  } catch (err: any) {
    console.error("[Firebase Safe Call Error]:", err);

    const errorMessage = parseFirebaseError(err) || fallbackMessage;

    return {
      data: null,
      error: err instanceof Error ? err : new Error(String(err)),
      errorMessage,
      success: false,
    };
  }
}
