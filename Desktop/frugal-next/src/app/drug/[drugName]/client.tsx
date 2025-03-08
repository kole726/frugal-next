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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {medicationData.drug?.medName}
        </h1>
        <p className="text-xl text-gray-600">
          {medicationData.drug?.bgFlag === 'G' ? 'Generic Medication' : 'Brand Medication'}
        </p>
      </div>

      {/* Medication Selection Dropdowns */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select Medication Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Variant Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="variant-select" className="text-sm font-medium text-gray-700 mb-2">
              Brand/Generic
            </label>
            <select
              id="variant-select"
              value={selectedVariant}
              onChange={handleVariantChange}
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              {medicationData.alternateDrugs?.map((variant, index) => (
                <option key={index} value={variant.medName}>
                  {getVariantLabel(variant)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Form Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="form-select" className="text-sm font-medium text-gray-700 mb-2">
              Form
            </label>
            <select
              id="form-select"
              value={selectedForm?.form || ''}
              onChange={handleFormChange}
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              disabled={!availableForms.length}
            >
              {availableForms.map((form, index) => (
                <option key={index} value={form.form}>
                  {form.form}
                </option>
              ))}
            </select>
          </div>
          
          {/* Strength/Dosage Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="strength-select" className="text-sm font-medium text-gray-700 mb-2">
              Dosage
            </label>
            <select
              id="strength-select"
              value={selectedStrength?.strength || ''}
              onChange={handleStrengthChange}
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              disabled={!availableStrengths.length}
            >
              {availableStrengths.map((strength, index) => (
                <option key={index} value={strength.strength}>
                  {strength.strength}
                </option>
              ))}
            </select>
          </div>
          
          {/* Quantity Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="quantity-select" className="text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <select
              id="quantity-select"
              value={selectedQuantity ? `${selectedQuantity.quantity} ${selectedQuantity.uom}` : ''}
              onChange={handleQuantityChange}
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              disabled={!availableQuantities.length}
            >
              {availableQuantities.map((qty, index) => (
                <option key={index} value={`${qty.quantity} ${qty.uom}`}>
                  {qty.quantity} {qty.uom}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Selected Options Summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Selected Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-700">Variant:</span>{' '}
              {selectedVariant || 'Not selected'}
            </div>
            <div>
              <span className="font-medium text-gray-700">Form:</span>{' '}
              {selectedForm?.form || 'Not selected'}
            </div>
            <div>
              <span className="font-medium text-gray-700">Dosage:</span>{' '}
              {selectedStrength?.strength || 'Not selected'}
            </div>
            <div>
              <span className="font-medium text-gray-700">Quantity:</span>{' '}
              {selectedQuantity ? `${selectedQuantity.quantity} ${selectedQuantity.uom}` : 'Not selected'}
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <button 
            className="px-6 py-3 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedQuantity}
            onClick={() => {
              // In a real implementation, this would navigate to a price comparison page or show prices
              alert('Finding best prices for your selected medication...');
            }}
          >
            Find Best Prices
          </button>
        </div>
      </div>

      {/* Medication Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Medication Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-gray-700">Medication:</span> {medicationData.drug?.medName}
          </div>
          <div>
            <span className="font-medium text-gray-700">Type:</span> {medicationData.drug?.bgFlag === 'G' ? 'Generic' : 'Brand'}
          </div>
          {selectedForm && (
            <div>
              <span className="font-medium text-gray-700">Form:</span> {selectedForm.form}
            </div>
          )}
          {selectedStrength && (
            <div>
              <span className="font-medium text-gray-700">Strength:</span> {selectedStrength.strength}
            </div>
          )}
          {selectedQuantity && (
            <div>
              <span className="font-medium text-gray-700">Quantity:</span> {selectedQuantity.quantity} {selectedQuantity.uom}
            </div>
          )}
          <div>
            <span className="font-medium text-gray-700">GSN:</span> {selectedForm?.gsn || medicationData.drug?.gsn || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
} 