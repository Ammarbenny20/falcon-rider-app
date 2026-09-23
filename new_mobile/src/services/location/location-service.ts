import * as Location from 'expo-location';

export type LocationPermissionStatus = 'granted' | 'denied' | 'undetermined';

export async function requestForegroundPermission(): Promise<LocationPermissionStatus> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status as LocationPermissionStatus;
}

export async function getCurrentPosition() {
  return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
}
