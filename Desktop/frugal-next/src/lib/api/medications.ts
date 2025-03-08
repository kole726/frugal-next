import { getAuthToken } from './auth';

export interface Medication {
  drugId: string;
  drugName: string;
  genericName: string;
  brandName: string;
  dosageForm: string;
  strength: string;
  packageSize: string;
  ndc: string;
  gsn: string;
  isGeneric: boolean;
}

export interface Pharmacy {
  pharmacyId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  latitude: number;
  longitude: number;
  distance: number;
  chainCode?: string;
  open24H?: boolean;
}

export interface PricingResult {
  pharmacy: Pharmacy;
  price: number;
  discountPrice: number;
  savings: number;
  savingsPercentage: number;
  awpPrice?: number;
  macPrice?: number;
  ucPrice?: number;
  priceBasis?: string;
}

export interface DrugPricing {
  medication: Medication;
  pricing: PricingResult[];
}

export interface MedicationVariant {
  medName: string;
  isGeneric: boolean;
  selected: boolean;
}

export interface MedicationForm {
  form: string;
  selected: boolean;
  strengths: MedicationStrength[];
  gsn?: number;
}

export interface MedicationStrength {
  strength: string;
  selected: boolean;
  quantities: MedicationQuantity[];
  gsn?: number;
}

export interface MedicationQuantity {
  quantity: number;
  unit: string;
  selected: boolean;
}

export interface MedicationOptions {
  variants: MedicationVariant[];
  forms: MedicationForm[];
}

/**
 * Search for medications by name prefix
 */
export async function searchMedications(query: string): Promise<Medication[]> {
  try {
    const token = await getAuthToken();
    
    console.log(`Searching for medications with query: ${query}`);
    
    // Add validation to ensure query is at least 3 characters
    if (!query || query.trim().length < 3) {
      throw new Error('Search query must be at least 3 characters long');
    }
    
    const response = await fetch(`${process.env.AMERICAS_PHARMACY_API_URL}/drugs/names`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hqMappingName: "walkerrx",
        prefixText: query.trim()
      }),
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error response: ${errorText}`);
      throw new Error(`Medication search failed: ${response.status} ${response.statusText}`);
    }

    let data;
    try {
      data = await response.json();
      console.log('API response:', JSON.stringify(data, null, 2));
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
      throw new Error('Invalid response format from medication API');
    }
    
    // Check if the response is an array of strings (drug names)
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') {
      // Convert string array to Medication objects
      return data.map((drugName: string, index) => ({
        drugId: `drug-${index}`,
        drugName: drugName,
        genericName: '',
        brandName: drugName,
        dosageForm: '',
        strength: '',
        packageSize: '',
        ndc: '',
        gsn: '',
        isGeneric: false
      }));
    }
    // Check if the response has the expected structure (array of objects)
    else if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
      // Map the data to ensure it matches the Medication interface
      return data.map((drug: any) => ({
        drugId: drug.drugId || drug.gsn || '',
        drugName: drug.drugName || '',
        genericName: drug.genericName || '',
        brandName: drug.brandName || '',
        dosageForm: drug.dosageForm || '',
        strength: drug.strength || '',
        packageSize: drug.packageSize || '',
        ndc: drug.ndc || '',
        gsn: drug.gsn || '',
        isGeneric: Boolean(drug.isGeneric)
      }));
    } else if (data && data.results && Array.isArray(data.results)) {
      // Map the results to ensure they match the Medication interface
      return data.results.map((drug: any) => ({
        drugId: drug.drugId || drug.gsn || '',
        drugName: drug.drugName || '',
        genericName: drug.genericName || '',
        brandName: drug.brandName || '',
        dosageForm: drug.dosageForm || '',
        strength: drug.strength || '',
        packageSize: drug.packageSize || '',
        ndc: drug.ndc || '',
        gsn: drug.gsn || '',
        isGeneric: Boolean(drug.isGeneric)
      }));
    } else {
      console.warn('Unexpected API response format:', data);
      return [];
    }
  } catch (error) {
    console.error('Error searching medications:', error);
    throw error;
  }
}

/**
 * Get pricing for a specific medication by name
 */
export async function getMedicationPricing(
  drugName: string, 
  zipCode: string, 
  radius: number = 10
): Promise<DrugPricing> {
  try {
    const token = await getAuthToken();
    
    // Convert zipCode to coordinates (this would typically use a geocoding service)
    // For now, we'll use a placeholder implementation
    const { latitude, longitude } = await getCoordinatesFromZipCode(zipCode);
    
    const response = await fetch(
      `${process.env.AMERICAS_PHARMACY_API_URL}/drugprices/byName`, 
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hqMappingName: "walkerrx", // Using the mapping name from the Postman collection
          drugName: drugName,
          latitude: latitude,
          longitude: longitude,
          // Optional parameters
          // customizedQuantity: true,
          // quantity: 30
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Pricing lookup failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting medication pricing:', error);
    throw error;
  }
}

/**
 * Get pricing for a specific medication by GSN (Generic Sequence Number)
 */
export async function getMedicationPricingByGSN(
  gsn: string,
  zipCode: string,
  quantity?: number
): Promise<DrugPricing> {
  try {
    const token = await getAuthToken();
    
    // Convert zipCode to coordinates
    const { latitude, longitude } = await getCoordinatesFromZipCode(zipCode);
    
    const requestBody: any = {
      hqMappingName: "walkerrx",
      gsn: parseInt(gsn),
      latitude: latitude,
      longitude: longitude,
    };
    
    // Add quantity if provided
    if (quantity) {
      requestBody.customizedQuantity = true;
      requestBody.quantity = quantity;
    }
    
    const response = await fetch(
      `${process.env.AMERICAS_PHARMACY_API_URL}/drugprices/byGSN`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`GSN pricing lookup failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting medication pricing by GSN:', error);
    throw error;
  }
}

/**
 * Get pricing for a specific medication by NDC (National Drug Code)
 */
export async function getMedicationPricingByNDC(
  ndc: string,
  zipCode: string,
  quantity?: number
): Promise<DrugPricing> {
  try {
    const token = await getAuthToken();
    
    // Convert zipCode to coordinates
    const { latitude, longitude } = await getCoordinatesFromZipCode(zipCode);
    
    const requestBody: any = {
      hqMappingName: "walkerrx",
      ndcCode: parseInt(ndc),
      latitude: latitude,
      longitude: longitude,
    };
    
    // Add quantity if provided
    if (quantity) {
      requestBody.customizedQuantity = true;
      requestBody.quantity = quantity;
    }
    
    const response = await fetch(
      `${process.env.AMERICAS_PHARMACY_API_URL}/drugprices/byNdcCode`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`NDC pricing lookup failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting medication pricing by NDC:', error);
    throw error;
  }
}

/**
 * Get detailed information about a specific medication
 */
export async function getMedicationDetails(drugName: string): Promise<Medication> {
  if (!drugName || drugName.trim() === '') {
    throw new Error('Drug name is required');
  }

  try {
    console.log(`Getting details for drug: ${drugName}`);
    
    // Since the API appears to be unavailable, we'll use mock data instead
    // In a real implementation, this would make an API call to get the medication details
    
    // Create a mock medication object based on the drug name
    const medication: Medication = {
      drugId: `mock-${Date.now()}`,
      drugName: drugName,
      genericName: drugName.toLowerCase().includes('tylenol') ? 'Acetaminophen' : drugName,
      brandName: drugName,
      dosageForm: 'TABLET',
      strength: '500 mg',
      packageSize: '100',
      ndc: '12345-678-90',
      gsn: '12345',
      isGeneric: !drugName.toLowerCase().includes('tylenol')
    };
    
    console.log('Mock medication data:', medication);
    return medication;
  } catch (error) {
    console.error('Error getting medication details:', error);
    throw error;
  }
}

/**
 * Get nearby pharmacies
 */
export async function getNearbyPharmacies(
  zipCode: string,
  count: number = 5
): Promise<Pharmacy[]> {
  try {
    const token = await getAuthToken();
    
    // Convert zipCode to coordinates
    const { latitude, longitude } = await getCoordinatesFromZipCode(zipCode);
    
    const response = await fetch(
      `${process.env.AMERICAS_PHARMACY_API_URL}/pharmacies?lat=${latitude}&long=${longitude}&hqmappingName=walkerrx&pharmacyCount=${count}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pharmacy lookup failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.pharmacies || [];
  } catch (error) {
    console.error('Error getting nearby pharmacies:', error);
    throw error;
  }
}

/**
 * Helper function to convert a ZIP code to coordinates
 * In a real application, this would use a geocoding service
 */
async function getCoordinatesFromZipCode(zipCode: string): Promise<{ latitude: number, longitude: number }> {
  // This is a placeholder implementation
  // In a real application, you would use a geocoding service like Google Maps Geocoding API
  
  // For testing, we'll return coordinates for Austin, TX
  return {
    latitude: 30.4015,
    longitude: -97.7527
  };
}

/**
 * Get medication variants, forms, strengths, and quantities
 */
export async function getMedicationOptions(drugName: string): Promise<MedicationOptions> {
  if (!drugName || drugName.trim() === '') {
    throw new Error('Drug name is required');
  }

  try {
    // For now, we'll use mock data since this appears to be using hardcoded mock data
    // In a real implementation, this would make an API call similar to getMedicationDetails
    console.log(`Getting options for drug: ${drugName}`);
    
    // Mock data for medication variants
    const variants: MedicationVariant[] = [
      { medName: "ACETAMINOPHEN", isGeneric: true, selected: true },
      { medName: "ARTHRITIS PAIN RELIEF (ACETAM)", isGeneric: true, selected: false },
      { medName: "CHILDREN'S ACETAMINOPHEN", isGeneric: true, selected: false },
      { medName: "CHILDREN'S EASY-MELTS", isGeneric: true, selected: false },
      { medName: "CHILDREN'S MAPAP", isGeneric: true, selected: false },
      { medName: "CHILDREN'S PAIN RELIEF", isGeneric: true, selected: false },
      { medName: "CHILDREN'S PAIN-FEVER RELIEF", isGeneric: true, selected: false },
      { medName: "FEVERALL", isGeneric: false, selected: false },
      { medName: "JR. STRENGTH PAIN RELIEVER", isGeneric: true, selected: false },
      { medName: "MAPAP (ACETAMINOPHEN)", isGeneric: true, selected: false },
      { medName: "NORTEMP", isGeneric: false, selected: false },
      { medName: "PAIN RELIEF (ACETAMINOPHEN)", isGeneric: true, selected: false },
      { medName: "PAIN RELIEVER ES(ACETAMINOPHN)", isGeneric: true, selected: false },
      { medName: "TYLENOL", isGeneric: false, selected: false },
      { medName: "TYLENOL EXTRA STRENGTH", isGeneric: false, selected: false },
    ];
    
    // Mock data for medication forms, strengths, and quantities
    const forms: MedicationForm[] = [
      {
        form: "TABLET",
        selected: true,
        strengths: [
          {
            strength: "325 mg",
            selected: false,
            quantities: [
              { quantity: 30, unit: "TABLET", selected: false },
              { quantity: 60, unit: "TABLET", selected: false },
              { quantity: 100, unit: "TABLET", selected: false }
            ],
            gsn: 12345
          },
          {
            strength: "500 mg",
            selected: true,
            quantities: [
              { quantity: 30, unit: "TABLET", selected: true },
              { quantity: 60, unit: "TABLET", selected: false },
              { quantity: 100, unit: "TABLET", selected: false }
            ],
            gsn: 12346
          },
          {
            strength: "650 mg",
            selected: false,
            quantities: [
              { quantity: 20, unit: "TABLET", selected: false },
              { quantity: 50, unit: "TABLET", selected: false },
              { quantity: 100, unit: "TABLET", selected: false }
            ],
            gsn: 12347
          }
        ]
      },
      {
        form: "CAPSULE",
        selected: false,
        strengths: [
          {
            strength: "325 mg",
            selected: true,
            quantities: [
              { quantity: 30, unit: "CAPSULE", selected: true },
              { quantity: 60, unit: "CAPSULE", selected: false }
            ],
            gsn: 12348
          },
          {
            strength: "500 mg",
            selected: false,
            quantities: [
              { quantity: 30, unit: "CAPSULE", selected: true },
              { quantity: 60, unit: "CAPSULE", selected: false }
            ],
            gsn: 12349
          }
        ]
      },
      {
        form: "LIQUID",
        selected: false,
        strengths: [
          {
            strength: "160 mg/5 mL",
            selected: true,
            quantities: [
              { quantity: 120, unit: "mL", selected: true },
              { quantity: 240, unit: "mL", selected: false }
            ],
            gsn: 12350
          },
          {
            strength: "500 mg/15 mL",
            selected: false,
            quantities: [
              { quantity: 120, unit: "mL", selected: true },
              { quantity: 240, unit: "mL", selected: false },
              { quantity: 480, unit: "mL", selected: false }
            ],
            gsn: 12351
          }
        ]
      },
      {
        form: "SUPPOSITORY",
        selected: false,
        strengths: [
          {
            strength: "120 mg",
            selected: true,
            quantities: [
              { quantity: 6, unit: "SUPPOSITORY", selected: true },
              { quantity: 12, unit: "SUPPOSITORY", selected: false }
            ],
            gsn: 12352
          },
          {
            strength: "325 mg",
            selected: false,
            quantities: [
              { quantity: 6, unit: "SUPPOSITORY", selected: true },
              { quantity: 12, unit: "SUPPOSITORY", selected: false }
            ],
            gsn: 12353
          }
        ]
      }
    ];
    
    return { variants, forms };
  } catch (error) {
    console.error('Error getting medication options:', error);
    throw error;
  }
}

/**
 * Get multi-drug pricing by name
 */
export async function getMultiDrugPricingByName(
  drugNames: string[],
  zipCode: string,
  quantities?: number[]
): Promise<any> {
  try {
    const token = await getAuthToken();
    
    // Convert zipCode to coordinates
    const { latitude, longitude } = await getCoordinatesFromZipCode(zipCode);
    
    // Prepare the drug list
    const drugList = drugNames.map((drugName, index) => {
      const drugItem: any = {
        drugName: drugName,
        brandGenericFlag: 'G', // Default to generic
      };
      
      // Add quantity if provided
      if (quantities && quantities[index]) {
        drugItem.customizedQuantity = true;
        drugItem.quantity = quantities[index];
      }
      
      return drugItem;
    });
    
    const response = await fetch(
      `${process.env.AMERICAS_PHARMACY_API_URL}/multidrugprices/byName`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hqMappingName: "walkerrx",
          latitude: latitude,
          longitude: longitude,
          drugList: drugList
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Multi-drug pricing by name lookup failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting multi-drug pricing by name:', error);
    throw error;
  }
}

/**
 * Get multi-drug pricing by GSN
 */
export async function getMultiDrugPricingByGSN(
  gsns: number[],
  zipCode: string,
  quantities?: number[]
): Promise<any> {
  try {
    const token = await getAuthToken();
    
    // Convert zipCode to coordinates
    const { latitude, longitude } = await getCoordinatesFromZipCode(zipCode);
    
    // Prepare the drug list
    const drugList = gsns.map((gsn, index) => {
      const drugItem: any = {
        gsn: gsn,
        brandGenericFlag: 'G', // Default to generic
      };
      
      // Add quantity if provided
      if (quantities && quantities[index]) {
        drugItem.customizedQuantity = true;
        drugItem.quantity = quantities[index];
      }
      
      return drugItem;
    });
    
    const response = await fetch(
      `${process.env.AMERICAS_PHARMACY_API_URL}/multidrugprices/byGSN`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hqMappingName: "walkerrx",
          latitude: latitude,
          longitude: longitude,
          drugList: drugList
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Multi-drug pricing by GSN lookup failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting multi-drug pricing by GSN:', error);
    throw error;
  }
} 