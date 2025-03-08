'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define interfaces based on the API response structure
interface MedicationApiResponse {
  drug: {
    medName: string;
    bgFlag: string; // "G" for generic, "B" for brand
    gsn: number;
    quantity: number;
    // other properties omitted for brevity
  };
  forms: MedicationForm[];
  strengths: MedicationStrength[];
  quantities: MedicationQuantity[];
  alternateDrugs: AlternateDrug[];
  pharmacies?: PharmacyPrice[]; // Add this if missing
  // other properties omitted for brevity
}

interface AlternateDrug {
  medName: string;
  bgFlag: string; // "G" for generic, "B" for brand
  selected: boolean;
  gsn?: number; // Some API responses include GSN in alternateDrugs
  // other properties omitted for brevity
}

interface MedicationForm {
  form: string;
  gsn: number;
  selected: boolean;
  rank: number;
}

interface MedicationStrength {
  strength: string;
  gsn: number;
  rank: number;
  selected: boolean;
}

interface MedicationQuantity {
  quantity: number;
  uom: string; // Unit of measure (e.g., "TABLET")
  rank: number;
  gsn: number;
  selected: boolean;
}

interface PharmacyPrice {
  pharmacyName: string;
  pharmacyAddress: string;
  distance?: number;
  price?: number;
  regularPrice?: number;
  savings?: number;
}

interface DrugPageClientProps {
  drugName: string;
}

export default function DrugPageClient({ drugName }: DrugPageClientProps) {
  const router = useRouter();
  
  // State for medication data
  const [medicationData, setMedicationData] = useState<MedicationApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for selected options
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedForm, setSelectedForm] = useState<MedicationForm | null>(null);
  const [selectedStrength, setSelectedStrength] = useState<MedicationStrength | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<MedicationQuantity | null>(null);
  
  // Derived state for dropdown options
  const [availableForms, setAvailableForms] = useState<MedicationForm[]>([]);
  const [availableStrengths, setAvailableStrengths] = useState<MedicationStrength[]>([]);
  const [availableQuantities, setAvailableQuantities] = useState<MedicationQuantity[]>([]);

  // Mock pharmacy prices for display
  const [pharmacyPrices, setPharmacyPrices] = useState<PharmacyPrice[]>([
    {
      pharmacyName: 'OneSource Specialty Medicine',
      pharmacyAddress: '8989 Forest Ln Ste 138, Dallas, TX 75243',
      distance: 1.2,
      price: 3.69,
    },
    {
      pharmacyName: 'Sina Rx Pharmacy',
      pharmacyAddress: '8050 Spring Valley Rd, Dallas, TX 75240',
      distance: 2.5,
      price: 3.69,
    },
    {
      pharmacyName: 'Preston Village Pharmacy',
      pharmacyAddress: '12700 Preston Rd Ste #115, Dallas, TX 75230',
      distance: 3.7,
      price: 3.69,
    },
    {
      pharmacyName: 'Preston Road Pharmacy',
      pharmacyAddress: '6901 Preston Rd, Dallas, TX 75205',
      distance: 4.3,
      price: 3.69,
    }
  ]);

  // Active tab state
  const [activeTab, setActiveTab] = useState<'prices' | 'favorites'>('prices');
  
  // Search radius state
  const [searchRadius, setSearchRadius] = useState<string>('50 MILES');
  
  // Sort option state
  const [sortOption, setSort] = useState<string>('PRICE');

  // Decode the drug name from the URL
  const decodedDrugName = decodeURIComponent(drugName);

  // Load the initial medication data
  useEffect(() => {
    async function loadDrugData() {
      console.log(`Starting to load data for drug: ${decodedDrugName}`);
      if (!decodedDrugName || decodedDrugName === 'undefined') {
        console.error('Invalid drug name:', decodedDrugName);
        setError('Invalid drug name. Please try searching for a medication first.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch medication data from our API proxy to Americas Pharmacy API
        console.log(`Fetching data for: ${decodedDrugName}`);
        const response = await fetch(`/api/medications/drugprices/byName?drugName=${encodeURIComponent(decodedDrugName)}`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data: MedicationApiResponse = await response.json();
        console.log('Medication data received:', data);
        
        setMedicationData(data);
        
        // Set initial selections
        if (data.alternateDrugs && data.alternateDrugs.length > 0) {
          const defaultVariant = data.alternateDrugs.find(v => v.selected) || data.alternateDrugs[0];
          setSelectedVariant(defaultVariant.medName);
          
          // If this is a specific brand variant, we may need to filter forms appropriate for this variant
          filterFormsForVariant(data, defaultVariant);
        }
      } catch (err) {
        console.error('Error loading drug data:', err);
        setError(`Failed to load medication information: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    }

    loadDrugData();
  }, [decodedDrugName]);

  // Helper function to filter forms based on the selected variant
  const filterFormsForVariant = (data: MedicationApiResponse, variant: AlternateDrug) => {
    if (!data || !variant) return;

    let availableFormsList: MedicationForm[] = [];
    
    // Special handling for brand-specific medications
    if (variant.bgFlag === 'B') {
      // For brand medications like Feverall, we need to identify the specific forms
      // We'll look at the GSNs and do special handling for known brands
      
      // For example, if variant.medName is "FEVERALL", we know it's only available as suppositories
      if (variant.medName === "FEVERALL") {
        // Filter to only include suppository form
        availableFormsList = data.forms.filter(f => f.form === "SUPP.RECT");
      } else if (variant.medName === "TYLENOL") {
        // Tylenol is typically tablets
        availableFormsList = data.forms.filter(f => 
          f.form === "TABLET" || f.form === "TABLET ER" || f.form === "CAPSULE"
        );
      } else if (variant.medName === "CHILDREN'S TYLENOL") {
        // Children's formulations are typically liquids/suspensions
        availableFormsList = data.forms.filter(f => 
          f.form === "LIQUID" || f.form === "ORAL SUSP" || f.form === "CHEWABLE"
        );
      } else if (variant.medName === "MAPAP") {
        // MAPAP may come in various forms
        availableFormsList = data.forms.filter(f => 
          f.form === "TABLET" || f.form === "CAPSULE" || f.form === "LIQUID"
        );
      } else {
        // For other brands, we don't have specific information, so use all forms
        availableFormsList = data.forms;
      }
    } else {
      // For generics, all forms are typically available
      availableFormsList = data.forms;
    }
    
    // If no forms are found through our special handling, fall back to all forms
    if (availableFormsList.length === 0) {
      availableFormsList = data.forms;
    }
    
    setAvailableForms(availableFormsList);
    
    // Select default form and update strengths/quantities
    if (availableFormsList.length > 0) {
      const defaultForm = availableFormsList.find(f => f.selected) || availableFormsList[0];
      setSelectedForm(defaultForm);
      
      // Update strengths based on selected form
      updateStrengthsForForm(data, defaultForm);
    } else {
      setSelectedForm(null);
      setSelectedStrength(null);
      setSelectedQuantity(null);
      setAvailableStrengths([]);
      setAvailableQuantities([]);
    }
  };

  // Helper function to update strengths based on selected form
  const updateStrengthsForForm = (data: MedicationApiResponse, form: MedicationForm) => {
    if (!data || !form) return;
    
    // Filter strengths that are applicable to the selected form
    // For accurate filtering, we should match by GSN
    // Often, the first few digits of GSN identify the medication class
    // while additional digits specify the form, strength, etc.
    const formStrengths = data.strengths.filter(s => 
      // Either match the exact form GSN, or match by the first few digits of GSN
      s.gsn === form.gsn || 
      s.gsn.toString().substring(0, 3) === form.gsn.toString().substring(0, 3)
    );
    
    setAvailableStrengths(formStrengths);
    
    const defaultStrength = formStrengths.find(s => s.selected) || formStrengths[0];
    if (defaultStrength) {
      setSelectedStrength(defaultStrength);
      
      // Update quantities based on selected form and strength
      updateQuantitiesForFormAndStrength(data, form, defaultStrength);
    } else {
      setSelectedStrength(null);
      setSelectedQuantity(null);
      setAvailableQuantities([]);
    }
  };

  // Helper function to update quantities based on selected form and strength
  const updateQuantitiesForFormAndStrength = (
    data: MedicationApiResponse, 
    form: MedicationForm,
    strength: MedicationStrength
  ) => {
    if (!data || !form) return;
    
    // Filter quantities that match the form's GSN
    // We need to ensure the UOM (unit of measure) matches the form
    // For example, TABLET form should show quantities in TABLET units
    const expectedUOM = getUOMForForm(form.form);
    
    const formQuantities = data.quantities.filter(q => 
      // Either match by GSN or make sure the UOM is appropriate for the form
      q.gsn === form.gsn || 
      (q.uom && q.uom === expectedUOM)
    );
    
    setAvailableQuantities(formQuantities);
    
    const defaultQuantity = formQuantities.find(q => q.selected) || formQuantities[0];
    if (defaultQuantity) {
      setSelectedQuantity(defaultQuantity);
    } else {
      setSelectedQuantity(null);
    }
  };

  // Helper function to determine the appropriate UOM for a form
  const getUOMForForm = (formName: string): string => {
    switch (formName) {
      case 'TABLET':
      case 'TABLET ER':
        return 'TABLET';
      case 'CAPSULE':
        return 'CAPSULE';
      case 'LIQUID':
      case 'ORAL SUSP':
      case 'SOLUTION':
      case 'ELIXIR':
        return 'ML';
      case 'SUPP.RECT':
        return 'SUPPOSITORY';
      case 'DROPS':
      case 'DROPS SUSP':
        return 'ML';
      default:
        return formName; // Use the form name as the UOM if no special mapping
    }
  };

  // Handle variant change
  const handleVariantChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const variantName = e.target.value;
    setSelectedVariant(variantName);
    
    // Find the selected variant in the alternateDrugs array
    const selectedVariantObj = medicationData?.alternateDrugs.find(v => v.medName === variantName);
    if (!selectedVariantObj) return;
    
    // In a real implementation, this would make a new API call with the selected variant
    try {
      setIsLoading(true);
      const response = await fetch(`/api/medications/drugprices/byName?drugName=${encodeURIComponent(variantName)}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: MedicationApiResponse = await response.json();
      console.log('Variant data received:', data);
      
      setMedicationData(data);
      
      // Filter forms for this variant
      filterFormsForVariant(data, selectedVariantObj);
    } catch (err) {
      console.error('Error loading variant data:', err);
      setError(`Failed to load variant information: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!medicationData) return;
    
    const formName = e.target.value;
    const newForm = availableForms.find(f => f.form === formName) || null;
    
    if (newForm) {
      setSelectedForm(newForm);
      
      // Update strengths and quantities based on selected form
      updateStrengthsForForm(medicationData, newForm);
    }
  };

  // Handle strength change
  const handleStrengthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!medicationData || !selectedForm) return;
    
    const strengthValue = e.target.value;
    const newStrength = availableStrengths.find(s => s.strength === strengthValue) || null;
    
    if (newStrength) {
      setSelectedStrength(newStrength);
      
      // Update quantities based on selected form and strength
      updateQuantitiesForFormAndStrength(medicationData, selectedForm, newStrength);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const quantityString = e.target.value;
    const [quantity, uom] = quantityString.split(' ');
    
    const newQuantity = availableQuantities.find(q => 
      q.quantity === Number(quantity) && q.uom === uom
    ) || null;
    
    if (newQuantity) {
      setSelectedQuantity(newQuantity);
    }
  };

  // Generate option element with format "Generic/Brand Name"
  const getVariantLabel = (variant: AlternateDrug) => {
    const brandGeneric = variant.bgFlag === 'G' ? '(generic)' : '(brand)';
    return `${variant.medName} ${brandGeneric}`;
  };

  // Formatted drug name for display
  const formatDrugName = (name: string) => {
    return name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Extract the basic generic name (e.g., "acetaminophen" from "TYLENOL")
  const getGenericName = (variant: string): string => {
    const genericNames: {[key: string]: string} = {
      'TYLENOL': 'acetaminophen',
      'ADVIL': 'ibuprofen',
      'MOTRIN': 'ibuprofen',
      'ALEVE': 'naproxen sodium',
      'BAYER': 'aspirin',
      'CLARITIN': 'loratadine',
      'ZYRTEC': 'cetirizine',
      'BENADRYL': 'diphenhydramine',
    };
    
    return genericNames[variant.toUpperCase()] || '';
  };

  // New function to calculate price discount percentage
  const calculateDiscount = (originalPrice: number, discountedPrice: number): number => {
    if (!originalPrice || !discountedPrice) return 0;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-spin h-12 w-12 border-4 border-pink-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg text-gray-600">Loading medication information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600 mb-4">
            We're experiencing technical difficulties with our medication database. 
            Please try again later or search for a different medication.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!medicationData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-700 mb-2">Medication Not Found</h2>
          <p className="text-yellow-600">We couldn't find information for "{decodedDrugName}".</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading medication information...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Data</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => router.push('/')} 
            className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150"
          >
            Return to Homepage
          </button>
        </div>
      ) : medicationData ? (
        <div>
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-purple-700 uppercase mb-1">FIND YOUR SAVINGS</h3>
            <div className="border-b-2 border-purple-600 w-48 mb-4"></div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {formatDrugName(decodedDrugName)} Coupon
              {getGenericName(decodedDrugName) && (
                <span className="text-gray-700"> (Generic {formatDrugName(getGenericName(decodedDrugName))})</span>
              )}
            </h1>
            {getGenericName(decodedDrugName) && (
              <p className="text-gray-600">
                Pricing is displayed for <span className="font-semibold uppercase">{getGenericName(decodedDrugName)}</span>, which is a less expensive option of <span className="font-semibold uppercase">{decodedDrugName}</span>
              </p>
            )}
          </div>

          {/* Medication options selectors */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Brand selector */}
            <div className="relative">
              <label className="block text-xs text-gray-500 mb-1 uppercase">Brand</label>
              <div className="relative">
                <select
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md appearance-none pr-8 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                >
                  {medicationData.alternateDrugs?.map((variant, idx) => (
                    <option key={idx} value={variant.medName}>
                      {variant.medName} {variant.bgFlag === 'G' ? '(generic)' : ''}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <span className="text-gray-500">▼</span>
                </div>
              </div>
            </div>

            {/* Form selector */}
            <div className="relative">
              <label className="block text-xs text-gray-500 mb-1 uppercase">Form</label>
              <div className="relative">
                <select
                  value={selectedForm?.form || ''}
                  onChange={(e) => {
                    const form = availableForms.find(f => f.form === e.target.value);
                    if (form) {
                      setSelectedForm(form);
                      updateStrengthsForForm(medicationData, form);
                    }
                  }}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md appearance-none pr-8 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                >
                  {availableForms.map((form, idx) => (
                    <option key={idx} value={form.form}>
                      {form.form}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <span className="text-gray-500">▼</span>
                </div>
              </div>
            </div>

            {/* Strength selector */}
            <div className="relative">
              <label className="block text-xs text-gray-500 mb-1 uppercase">Dosage</label>
              <div className="relative">
                <select
                  value={selectedStrength?.strength || ''}
                  onChange={(e) => {
                    const strength = availableStrengths.find(s => s.strength === e.target.value);
                    if (strength && selectedForm) {
                      setSelectedStrength(strength);
                      updateQuantitiesForFormAndStrength(medicationData, selectedForm, strength);
                    }
                  }}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md appearance-none pr-8 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                >
                  {availableStrengths.map((strength, idx) => (
                    <option key={idx} value={strength.strength}>
                      {strength.strength}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <span className="text-gray-500">▼</span>
                </div>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="relative">
              <label className="block text-xs text-gray-500 mb-1 uppercase">Quantity</label>
              <div className="relative">
                <select
                  value={selectedQuantity ? selectedQuantity.quantity.toString() : ''}
                  onChange={(e) => {
                    const qty = availableQuantities.find(q => q.quantity.toString() === e.target.value);
                    if (qty) {
                      setSelectedQuantity(qty);
                    }
                  }}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md appearance-none pr-8 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                >
                  {availableQuantities.map((qty, idx) => (
                    <option key={idx} value={qty.quantity.toString()}>
                      {qty.quantity} {qty.uom}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <span className="text-gray-500">▼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* Location button */}
          <div className="mb-6">
            <button className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition-colors">
              SET LOCATION
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <button 
                className={`pb-2 font-medium ${activeTab === 'prices' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('prices')}
              >
                PRICES
              </button>
              <button 
                className={`pb-2 font-medium ${activeTab === 'favorites' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('favorites')}
              >
                FAVORITE PHARMACY
              </button>
            </div>
          </div>

          {/* Results header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-gray-700 font-medium">RESULTS FOR DRUG</div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">SORT:</span>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-1 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="PRICE">PRICE</option>
                    <option value="DISTANCE">DISTANCE</option>
                    <option value="NAME">NAME</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <span className="text-purple-700">▼</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">SEARCH RADIUS:</span>
                <div className="relative">
                  <select
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-1 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="5 MILES">5 MILES</option>
                    <option value="10 MILES">10 MILES</option>
                    <option value="25 MILES">25 MILES</option>
                    <option value="50 MILES">50 MILES</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <span className="text-purple-700">▼</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pharmacy list */}
          <div className="space-y-4 mb-8">
            {pharmacyPrices.map((pharmacy, index) => (
              <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Pharmacy info */}
                  <div className="p-4 flex-grow">
                    <div className="flex items-start">
                      <div className="mr-3 text-gray-400">
                        {index + 6}.
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 uppercase">{pharmacy.pharmacyName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{pharmacy.pharmacyAddress}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {pharmacy.distance !== undefined && (
                            <span>9am to 5pm</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="p-4 bg-gray-50 flex items-center justify-between md:w-64">
                    <div className="text-xl font-bold text-gray-800">${pharmacy.price?.toFixed(2)}</div>
                    <button className="bg-white border border-purple-700 text-purple-700 px-3 py-1 rounded text-sm hover:bg-purple-50 transition-colors">
                      GET FREE COUPON
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map view option */}
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="mb-4">Want to see these pharmacies on a map?</div>
            <button className="bg-purple-700 text-white px-6 py-2 rounded-md uppercase font-medium hover:bg-purple-800 transition-colors">
              Open Map View
            </button>
          </div>

          {/* Drug information link */}
          <div className="mt-8">
            <a href="#" className="text-purple-700 font-medium flex items-center">
              ACETAMINOPHEN DRUG INFORMATION
              <span className="ml-1">›</span>
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
} 