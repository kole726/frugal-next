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
      pharmacyName: 'Walgreens',
      pharmacyAddress: '123 Main St, Anytown, USA',
      distance: 1.2,
      price: 12.99,
      regularPrice: 24.99,
      savings: 12.00
    },
    {
      pharmacyName: 'CVS Pharmacy',
      pharmacyAddress: '456 Oak Ave, Anytown, USA',
      distance: 2.5,
      price: 13.49,
      regularPrice: 22.99,
      savings: 9.50
    },
    {
      pharmacyName: 'Walmart Pharmacy',
      pharmacyAddress: '789 Elm St, Anytown, USA',
      distance: 3.7,
      price: 9.99,
      regularPrice: 19.99,
      savings: 10.00
    },
    {
      pharmacyName: 'Rite Aid',
      pharmacyAddress: '101 Pine Blvd, Anytown, USA',
      distance: 4.3,
      price: 14.99,
      regularPrice: 28.99,
      savings: 14.00
    }
  ]);

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
        return 'SUPP.RECT';
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
    <div className="max-w-7xl mx-auto px-6 py-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
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
          {/* Breadcrumb navigation */}
          <div className="flex items-center text-sm mb-6 text-gray-500">
            <a href="/" className="hover:text-green-600 transition-colors">Home</a>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-700 font-medium">
              {formatDrugName(decodedDrugName)}
            </span>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Drug information */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="pb-4 border-b border-gray-100">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {formatDrugName(selectedVariant || decodedDrugName)}
                  </h1>
                  {getGenericName(selectedVariant || decodedDrugName) && (
                    <p className="text-sm text-gray-500 mt-1">
                      Generic Name: {getGenericName(selectedVariant || decodedDrugName)}
                    </p>
                  )}
                  {selectedForm && selectedStrength && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {selectedForm.form}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {selectedStrength.strength}
                      </span>
                      {selectedQuantity && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {selectedQuantity.quantity} {selectedQuantity.uom.toLowerCase()}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Drug options selectors */}
                <div className="mt-6 space-y-4">
                  {/* Medication variant */}
                  {medicationData.alternateDrugs && medicationData.alternateDrugs.length > 1 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Medication Type
                      </label>
                      <select
                        value={selectedVariant}
                        onChange={(e) => setSelectedVariant(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        {medicationData.alternateDrugs.map((variant, idx) => (
                          <option key={idx} value={variant.medName}>
                            {variant.medName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Form */}
                  {availableForms.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Form
                      </label>
                      <select
                        value={selectedForm?.form || ''}
                        onChange={(e) => {
                          const form = availableForms.find(f => f.form === e.target.value);
                          if (form) {
                            setSelectedForm(form);
                            // Call update function
                            updateStrengthsForForm(medicationData, form);
                          }
                        }}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        {availableForms.map((form, idx) => (
                          <option key={idx} value={form.form}>
                            {form.form}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Strength */}
                  {availableStrengths.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Strength
                      </label>
                      <select
                        value={selectedStrength?.strength || ''}
                        onChange={(e) => {
                          const strength = availableStrengths.find(s => s.strength === e.target.value);
                          if (strength && selectedForm) {
                            setSelectedStrength(strength);
                            // Call update function
                            updateQuantitiesForFormAndStrength(medicationData, selectedForm, strength);
                          }
                        }}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        {availableStrengths.map((strength, idx) => (
                          <option key={idx} value={strength.strength}>
                            {strength.strength}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Quantity */}
                  {availableQuantities.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <select
                        value={selectedQuantity ? selectedQuantity.quantity.toString() : ''}
                        onChange={(e) => {
                          const qty = availableQuantities.find(q => q.quantity.toString() === e.target.value);
                          if (qty) {
                            setSelectedQuantity(qty);
                          }
                        }}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        {availableQuantities.map((qty, idx) => (
                          <option key={idx} value={qty.quantity.toString()}>
                            {qty.quantity} {qty.uom}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                
                {/* Information about the drug */}
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">About this medication</h3>
                      <p className="mt-1 text-sm text-blue-700">
                        Prices may vary based on location, pharmacy, and insurance coverage. 
                        Always consult with healthcare professionals before starting any medication.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Prices */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Lowest Prices Near You
                </h2>

                {/* Pharmacy prices */}
                <div className="space-y-4">
                  {pharmacyPrices.map((pharmacy, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4">
                        {/* Pharmacy info */}
                        <div className="p-4 md:col-span-2">
                          <div className="flex items-start">
                            <div>
                              <h3 className="font-semibold text-gray-800">{pharmacy.pharmacyName}</h3>
                              <p className="text-sm text-gray-500">{pharmacy.pharmacyAddress}</p>
                              {pharmacy.distance !== undefined && (
                                <p className="text-xs text-gray-400 mt-1">
                                  {pharmacy.distance.toFixed(1)} miles away
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="p-4 border-t md:border-t-0 md:border-l border-gray-200 md:col-span-2">
                          <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-gray-800">${pharmacy.price?.toFixed(2)}</span>
                            {pharmacy.regularPrice && (
                              <span className="ml-2 text-sm line-through text-gray-500">
                                ${pharmacy.regularPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          {pharmacy.savings && pharmacy.regularPrice && (
                            <div className="mt-1 text-sm text-green-600">
                              Save ${pharmacy.savings.toFixed(2)} 
                              ({calculateDiscount(pharmacy.regularPrice, pharmacy.price || 0)}% off)
                            </div>
                          )}
                        </div>

                        {/* Get coupon button */}
                        <div className="p-4 bg-gray-50 md:rounded-none md:col-span-1 text-center">
                          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-150 shadow-sm">
                            Get Coupon
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Information callout */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">How to use your coupon</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>Click the "Get Coupon" button for your preferred pharmacy</li>
                          <li>Present the coupon at the pharmacy when picking up your prescription</li>
                          <li>Pay the discounted price shown on the coupon</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
} 