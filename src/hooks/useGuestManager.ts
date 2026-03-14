import { supabase } from '../lib/supabase';
import { Guest, Preference, Trip } from '../types';
import * as Linking from 'expo-linking';

export function useGuestManager() {
    const addGuest = async (tripId: string, guest: Omit<Guest, 'id'>) => {
        const { data, error } = await supabase
            .from('guests')
            .insert([{ ...guest, trip_id: tripId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    };

    const updateTripStamina = async (tripId: string, staminaScore: number) => {
        const { error } = await supabase
            .from('trips')
            .update({ stamina_score: staminaScore })
            .eq('id', tripId);

        if (error) throw error;
    };

    const setPreference = async (guestId: string, pref: Omit<Preference, 'id' | 'guest_id'>) => {
        const { data, error } = await supabase
            .from('preferences')
            .upsert([{ ...pref, guest_id: guestId }])
            .select();

        if (error) throw error;
        return data;
    };

    const getGuestsWithPreferences = async (tripId: string) => {
        const { data, error } = await supabase
            .from('guests')
            .select(`
        *,
        preferences (*)
      `)
            .eq('trip_id', tripId);

        if (error) throw error;
        return data;
    };

    const checkHeightConflicts = (guests: Guest[], requirementCm: number) => {
        return guests.filter(g => g.height_cm < requirementCm);
    };

    const generateSurveyLink = (tripId: string) => {
        const baseUrl = Linking.createURL('survey');
        return `${baseUrl}?tripId=${tripId}`;
    };

    return {
        addGuest,
        setPreference,
        updateTripStamina,
        getGuestsWithPreferences,
        checkHeightConflicts,
        generateSurveyLink,
    };
}
