import React, { useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import type { Activity } from '@/types';
import { AppButton } from '@/common/components/AppButton';
import { Card } from '@/common/components/Card';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { getTextScale, useAppStore } from '@/store/AppStore';

export function EvidenceLocationScreen({
  activity,
  onCancel,
  onDone,
}: {
  activity?: Activity;
  onCancel: () => void;
  onDone: (evidence?: { location?: Activity['evidenceLocation'] }) => void;
}) {
  const [permission, requestPermission] = Location.useForegroundPermissions();
  const [isSharing, setIsSharing] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationLabel, setLocationLabel] = useState('Ubicación actual detectada');
  const [locationCoords, setLocationCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const { appearance } = useAppStore();
  const scale = getTextScale(appearance.textSize);
  const mapKey = locationCoords ? `${locationCoords.latitude}-${locationCoords.longitude}` : 'default-location';
  const isApproximatePermission = permission?.android?.accuracy === 'coarse';

  const formatCoordinatesLabel = (latitude: number, longitude: number) =>
    `Lat ${latitude.toFixed(5)}, Lon ${longitude.toFixed(5)}`;

  const buildLocationLabel = (place?: Location.LocationGeocodedAddress | null) => {
    if (!place) return 'Ubicación actual detectada';

    if (place.formattedAddress) return place.formattedAddress;

    const addressParts = [place.street, place.streetNumber, place.district, place.city, place.region, place.country].filter(Boolean);
    if (addressParts.length > 0) return addressParts.join(', ');

    return 'Ubicación actual detectada';
  };

  const fetchLocation = async () => {
    if (isLoadingLocation) return;

    setIsLoadingLocation(true);
    try {
      if ((await Location.hasServicesEnabledAsync()) === false) {
        Alert.alert('Ubicación desactivada', 'Activa los servicios de ubicación del dispositivo y vuelve a intentar.');
        return null;
      }

      if (Location.enableNetworkProviderAsync) {
        try {
          await Location.enableNetworkProviderAsync();
        } catch {
          // If the user declines, we still continue with GPS.
        }
      }

      let currentLocation;
      try {
        currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
          mayShowUserSettingsDialog: true,
        });
      } catch {
        const lastKnownLocation = await Location.getLastKnownPositionAsync({
          requiredAccuracy: 1000,
          maxAge: 10 * 60 * 1000,
        });

        if (!lastKnownLocation) {
          Alert.alert('No se pudo obtener la ubicación', 'Activa el GPS y muévete a un lugar con mejor señal para intentar de nuevo.');
          return null;
        }

        currentLocation = lastKnownLocation;
      }

      const resolvedCoords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocationCoords(resolvedCoords);

      if (currentLocation.coords.accuracy != null) {
        setLocationAccuracy(currentLocation.coords.accuracy);
      }

      const [place] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const label = buildLocationLabel(place);
      const resolvedLabel = label === 'Ubicación actual detectada' ? formatCoordinatesLabel(resolvedCoords.latitude, resolvedCoords.longitude) : label;
      setLocationLabel(resolvedLabel);

      return {
        coords: resolvedCoords,
        label: resolvedLabel,
        accuracy: currentLocation.coords.accuracy,
      };
    } finally {
      setIsLoadingLocation(false);
    }

    return null;
  };

  useEffect(() => {
    if (permission?.granted && !locationCoords) {
      void fetchLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission?.granted]);

  const shareLocation = async () => {
    if (isSharing) return;

    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }

    if (isApproximatePermission) {
      Alert.alert(
        'Ubicación no precisa',
        'El sistema solo tiene acceso a una ubicación aproximada. Activa la ubicación precisa en los permisos del dispositivo para evitar que la ciudad salga incorrecta.',
      );
      return;
    }

    setIsSharing(true);
    try {
      const resolvedLocation = await fetchLocation();

      if (!resolvedLocation) return;

      if (resolvedLocation.accuracy != null && resolvedLocation.accuracy > 1000) {
        Alert.alert(
          'Precisión insuficiente',
          `La ubicación detectada tiene un margen de error alto (${Math.round(resolvedLocation.accuracy)} m). Muévete a un lugar abierto o activa GPS de alta precisión e inténtalo de nuevo.`,
        );
        return;
      }

      onDone({
        location: {
          ...resolvedLocation.coords,
          label: resolvedLocation.label,
          accuracy: resolvedLocation.accuracy,
        },
      });
    } finally {
      setIsSharing(false);
    }
  };

  if (permission && !permission.granted) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Pressable onPress={onCancel} style={styles.backButton}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
            <Text style={[styles.backText, { fontSize: 16 * scale }]}>Actividades</Text>
          </Pressable>

          <Card style={styles.card}>
            <View style={styles.iconCircle}>
              <Ionicons name="location-outline" size={36} color="#fff" />
            </View>
            <Text style={[styles.title, { fontSize: 24 * scale }]}>Evidencia de ubicación</Text>
            <Text style={[styles.subtitle, { fontSize: 14 * scale }]}>Necesitamos permiso de ubicación para compartir tu punto actual con tu familiar o familiares.</Text>
            <View style={styles.permissionBox}>
              <Ionicons name="map-outline" size={28} color={colors.primary} />
              <Text style={styles.permissionText}>Activa el permiso de ubicación para continuar.</Text>
            </View>
            <View style={styles.actions}>
              <AppButton title="Cancelar" variant="outline" onPress={onCancel} style={styles.flex} />
              <AppButton title="Permitir ubicación" onPress={requestPermission} style={styles.flex} />
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={onCancel} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
          <Text style={[styles.backText, { fontSize: 16 * scale }]}>Actividades</Text>
        </Pressable>

        <Card style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="location-outline" size={36} color="#fff" />
          </View>
          <Text style={[styles.title, { fontSize: 24 * scale }]}>Evidencia de ubicación</Text>
          <Text style={[styles.subtitle, { fontSize: 14 * scale }]}>Comparte tu ubicación para registrar esta actividad y notificar a tu familiar o familiares.</Text>

          <View style={styles.preview}>
            {locationCoords ? (
              <>
                <MapView
                  key={mapKey}
                  style={styles.map}
                  initialRegion={{
                    latitude: locationCoords.latitude,
                    longitude: locationCoords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: locationCoords.latitude,
                      longitude: locationCoords.longitude,
                    }}
                    title="Ubicación detectada"
                    description={locationLabel}
                  />
                </MapView>
                <View style={styles.mapBadge}>
                  <Ionicons name="map-outline" size={16} color={colors.primary} />
                </View>
                <View style={styles.locationChip}>
                  <Ionicons name="pin-outline" size={16} color={colors.primary} />
                  <Text style={styles.locationChipText}>{locationLabel}</Text>
                </View>
                {locationAccuracy != null ? <Text style={styles.coordsText}>Precisión estimada: {Math.round(locationAccuracy)} m</Text> : null}
              </>
            ) : isLoadingLocation ? (
              <View style={styles.emptyLocationState}>
                <Ionicons name="refresh-outline" size={30} color={colors.primary} />
                <Text style={styles.previewTitle}>Cargando ubicación</Text>
                <Text style={styles.previewText}>Estamos intentando obtener la posición real del dispositivo.</Text>
              </View>
            ) : (
              <View style={styles.emptyLocationState}>
                <Ionicons name="navigate-outline" size={30} color={colors.primary} />
                <Text style={styles.previewTitle}>Esperando ubicación real</Text>
                <Text style={styles.previewText}>Todavía no se ha detectado una posición precisa del dispositivo.</Text>
              </View>
            )}
          </View>

          <View style={styles.actions}>
            <AppButton
              title={isSharing ? 'Compartiendo...' : 'Compartir ubicación'}
              onPress={shareLocation}
              disabled={isSharing}
              style={styles.shareButton}
              textStyle={styles.shareButtonText}
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  backButton: {
    position: 'absolute',
    top: 14,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    zIndex: 2,
  },
  backText: {
    color: '#fff',
    fontWeight: '900',
  },
  card: {
    gap: 14,
    padding: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primary,
  },
  title: {
    color: colors.primary,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  preview: {
    minHeight: 360,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.26)',
    backgroundColor: 'rgba(248, 251, 255, 0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 12,
  },
  map: {
    width: '100%',
    alignSelf: 'stretch',
    height: 280,
    borderRadius: 18,
    overflow: 'hidden',
  },
  mapBadge: {
    position: 'absolute',
    top: 28,
    left: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  mapBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  previewTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  previewText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
  emptyLocationState: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 10,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#e9f6f2',
  },
  locationChipText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
  },
  coordsText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  permissionBox: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dbeafe',
    backgroundColor: '#f8fbff',
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  permissionText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  actions: {
    marginTop: 4,
    flexDirection: 'row',
    gap: 10,
  },
  flex: {
    flex: 1,
  },
  shareButton: {
    flex: 1,
    minHeight: 62,
    paddingVertical: 16,
  },
  shareButtonText: {
    fontSize: 18,
    fontWeight: '900',
  },
});
