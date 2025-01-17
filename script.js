// Navigation and Section Display
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active-section');
    });
    document.getElementById(sectionId).classList.add('active-section');
}

function toggleSpouseData() {
  const statusPerkawinan = document.getElementById('statusPerkawinan').value;
  const spouseData = document.getElementById('spouseData');
  const spouseInputs = spouseData.getElementsByTagName('input');

  if (statusPerkawinan === 'married') {
      spouseData.style.display = 'block';
      spouseData.classList.remove('fade-out');
      spouseData.classList.add('fade-in');
      
      // Make spouse fields required
      for (let input of spouseInputs) {
          input.required = true;
      }
  } else {
      spouseData.classList.remove('fade-in');
      spouseData.classList.add('fade-out');
      
      // Remove required attribute and clear values
      for (let input of spouseInputs) {
          input.required = false;
          input.value = '';
      }
      
      setTimeout(() => {
          spouseData.style.display = 'none';
      }, 500);
  }
}

// Credit Application Form Submission
function submitCreditApplication(event) {
  event.preventDefault();
  
  // Gather form data
  const formData = {
      nama: document.getElementById('nama').value,
      nik: document.getElementById('nik').value,
      tanggalLahir: document.getElementById('tanggalLahir').value,
      statusPerkawinan: document.getElementById('statusPerkawinan').value,
      merkKendaraan: document.getElementById('merkKendaraan').value,
      modelKendaraan: document.getElementById('modelKendaraan').value,
      tipe: document.getElementById('tipeKendaraan').value,
            warna: document.getElementById('warnaKendaraan').value,
      hargaKendaraan: document.getElementById('hargaKendaraan').value,
  };

  // Add spouse data if married
  if (formData.statusPerkawinan === 'married') {
      formData.spouse = {
          nama: document.getElementById('namaPasangan').value,
          nik: document.getElementById('nikPasangan').value,
          tanggalLahir: document.getElementById('tanggalLahirPasangan').value,
          pekerjaan: document.getElementById('pekerjaanPasangan').value,
          penghasilan: document.getElementById('penghasilanPasangan').value
      };

      // Validate spouse NIK
      if (!validateNIK(formData.spouse.nik)) {
          showNotification('NIK Pasangan tidak valid', 'error');
          return;
      }
  }

  // Validate primary NIK
  if (!validateNIK(formData.nik)) {
      showNotification('NIK tidak valid', 'error');
      return;
  }

  // Simulate API call
  setTimeout(() => {
      const applicationId = generateApplicationId();
      showNotification(`Pengajuan berhasil! Nomor pengajuan Anda: ${applicationId}`, 'success');
      document.getElementById('creditForm').reset();
      document.getElementById('spouseData').style.display = 'none';
  }, 1500);
}

// Add new function for vehicle data validation
function validateVehicleData(vehicleData) {
  if (!vehicleData.merk || !vehicleData.model || !vehicleData.tipe || !vehicleData.warna) {
      showNotification('Mohon lengkapi semua data kendaraan', 'error');
      return false;
  }

  if (vehicleData.harga <= 0) {
      showNotification('Harga kendaraan tidak valid', 'error');
      return false;
  }

  return true;
}

// Add dynamic model options based on selected brand
document.getElementById('merkKendaraan').addEventListener('change', function() {
  const modelSelect = document.getElementById('modelKendaraan');
  const selectedBrand = this.value;
  
  // Clear current model value
  modelSelect.value = '';
  
  // Example of dynamic model options based on brand
  const modelOptions = {
      toyota: ['Avanza', 'Innova', 'Fortuner', 'Camry', 'Corolla'],
      honda: ['Brio', 'Jazz', 'CR-V', 'HR-V', 'Civic'],
      suzuki: ['Ertiga', 'XL7', 'Swift', 'Ignis', 'Baleno']
  };

  if (modelOptions[selectedBrand]) {
      modelSelect.type = 'select';
      // Convert input to select
      const selectElement = document.createElement('select');
      selectElement.id = 'modelKendaraan';
      selectElement.required = true;
      
      // Add default option
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Pilih Model';
      selectElement.appendChild(defaultOption);
      
      // Add model options
      modelOptions[selectedBrand].forEach(model => {
          const option = document.createElement('option');
          option.value = model.toLowerCase();
          option.textContent = model;
          selectElement.appendChild(option);
      });
      
      // Replace input with select
      modelSelect.parentNode.replaceChild(selectElement, modelSelect);
  }
});

// NIK Validation
function validateNIK(nik) {
    return nik.length === 16 && /^\d+$/.test(nik);
}

// Status Checking
function checkStatus() {
    const applicationId = document.getElementById('applicationId').value;
    if (!applicationId) {
        showNotification('Masukkan nomor pengajuan', 'error');
        return;
    }

    // Simulate status check
    const statuses = ['Verifikasi Data', 'Proses Approval', 'Pencairan Dana'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    const statusResult = document.getElementById('statusResult');
    statusResult.innerHTML = `
        <div class="status-success">
            <h4>Status Pengajuan: ${applicationId}</h4>
            <p>Tahap: ${randomStatus}</p>
            <p>Update terakhir: ${new Date().toLocaleString()}</p>
        </div>
    `;
}

// Document Upload
function uploadDocuments() {
    const fileInput = document.getElementById('additionalDocs');
    if (fileInput.files.length === 0) {
        showNotification('Pilih dokumen untuk diupload', 'error');
        return;
    }

    // Simulate upload process
    showNotification('Sedang mengupload dokumen...', 'info');
    setTimeout(() => {
        showNotification('Dokumen berhasil diupload!', 'success');
        updateDocumentsList(Array.from(fileInput.files));
        fileInput.value = '';
    }, 2000);
}

// Update Documents List
function updateDocumentsList(newFiles) {
    const documentsList = document.getElementById('documentsList');
    newFiles.forEach(file => {
        const docElement = document.createElement('div');
        docElement.className = 'document-item';
        docElement.innerHTML = `
            <p>${file.name}</p>
            <small>Diupload: ${new Date().toLocaleString()}</small>
        `;
        documentsList.appendChild(docElement);
    });
}

// Utility Functions
function generateApplicationId() {
    return 'APP' + Date.now().toString().slice(-8);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// OCR Simulation for KTP
document.getElementById('ktpUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        simulateOCR(file);
    }
});

function simulateOCR(file) {
    showNotification('Memproses dokumen KTP...', 'info');
    setTimeout(() => {
        // Simulate OCR result
        document.getElementById('nik').value = '3174040501990001';
        document.getElementById('nama').value = 'BUDI SANTOSO';
        showNotification('Data KTP berhasil diekstrak', 'success');
    }, 2000);
}

// Initialize event listeners when document loads
document.addEventListener('DOMContentLoaded', function() {
    // Set initial active section
    showSection('beranda');

    // Add navigation event listeners
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').slice(1);
            showSection(sectionId);
        });
    });
});

// Add these new functions for loan calculations

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Add input listeners for loan calculations
  const dpInput = document.getElementById('dpPercentage');
  const hargaInput = document.getElementById('hargaKendaraan');
  const tenorSelect = document.getElementById('lamaKredit');
  const asuransiSelect = document.getElementById('jenisAsuransi');
  
  dpInput.addEventListener('input', calculateDP);
  hargaInput.addEventListener('input', calculateLoan);
  tenorSelect.addEventListener('change', calculateLoan);
  asuransiSelect.addEventListener('change', calculateLoan);
});

function calculateDP() {
  const hargaKendaraan = parseFloat(document.getElementById('hargaKendaraan').value) || 0;
  let dpPercentage = parseFloat(document.getElementById('dpPercentage').value) || 0;
  
  // Limit DP to 100%
  if (dpPercentage > 100) {
      dpPercentage = 100;
      document.getElementById('dpPercentage').value = 100;
      showNotification('Maksimum DP adalah 100%', 'info');
  }
  
  const dpAmount = (hargaKendaraan * dpPercentage) / 100;
  document.getElementById('dpAmount').value = dpAmount.toFixed(0);
  
  calculateLoan();
}

// Calculate Monthly Installment
function calculateLoan() {
  // Get input values
  const hargaKendaraan = parseFloat(document.getElementById('hargaKendaraan').value) || 0;
  const dpAmount = parseFloat(document.getElementById('dpAmount').value) || 0;
  const tenor = parseInt(document.getElementById('lamaKredit').value) || 0;
  const jenisAsuransi = document.getElementById('jenisAsuransi').value;
  
  // Base interest rate (flat)
  const baseInterestRate = 6; // 6% per tahun
  
  // Calculate loan principal (pokok pinjaman)
  const pokokPinjaman = hargaKendaraan - dpAmount;
  
  // Calculate total interest for the loan period
  const totalInterest = (pokokPinjaman * (baseInterestRate/100) * (tenor/12));
  
  // Calculate insurance cost
  const insuranceCost = calculateInsuranceCost(hargaKendaraan, jenisAsuransi, tenor);
  
  // Calculate total loan amount including interest
  const totalLoan = pokokPinjaman + totalInterest;
  
  // Calculate monthly installment (not including insurance)
  const monthlyInstallment = tenor > 0 ? totalLoan / tenor : 0;
  
  // Calculate monthly insurance
  const monthlyInsurance = tenor > 0 ? insuranceCost / tenor : 0;
  
  // Total monthly payment including insurance
  const totalMonthlyPayment = monthlyInstallment + monthlyInsurance;
  
  // Update loan summary display
  updateLoanSummary({
      hargaKendaraan: hargaKendaraan,
      dpAmount: dpAmount,
      pokokPinjaman: pokokPinjaman,
      baseInterestRate: baseInterestRate,
      insuranceCost: insuranceCost,
      totalMonthlyPayment: totalMonthlyPayment
  });
}

// Calculate Insurance Cost
function calculateInsuranceCost(hargaKendaraan, jenisAsuransi, tenor) {
  let rate;
  switch(jenisAsuransi) {
      case 'comprehensive':
          rate = 0.025; // 2.5% per year
          break;
      case 'tlo':
          rate = 0.01; // 1% per year
          break;
      default:
          rate = 0;
  }
  
  const yearlyInsurance = hargaKendaraan * rate;
  return yearlyInsurance * (tenor / 12);
}

// Update Loan Summary Display
function updateLoanSummary(data) {
  // Format and display values in summary
  document.getElementById('summaryHargaKendaraan').textContent = formatCurrency(data.hargaKendaraan);
  document.getElementById('summaryDP').textContent = formatCurrency(data.dpAmount);
  document.getElementById('summaryPokokPinjaman').textContent = formatCurrency(data.pokokPinjaman);
  document.getElementById('summaryBunga').textContent = `${data.baseInterestRate}%`;
  document.getElementById('summaryAsuransi').textContent = formatCurrency(data.insuranceCost);
  document.getElementById('summaryAngsuran').textContent = formatCurrency(data.totalMonthlyPayment);
}

// Format Currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
  }).format(amount);
}

// Add input event listener when document loads
document.addEventListener('DOMContentLoaded', function() {
    const dpInput = document.getElementById('dpPercentage');
    
    // Add input validation for DP percentage
    dpInput.addEventListener('input', function() {
        if (this.value > 100) {
            this.value = 100;
        }
        calculateDP();
    });
    
    // Add other existing event listeners for loan calculations
    document.getElementById('hargaKendaraan').addEventListener('input', calculateLoan);
    document.getElementById('lamaKredit').addEventListener('change', calculateLoan);
    document.getElementById('jenisAsuransi').addEventListener('change', calculateLoan);
});

// Update validateLoanData function
function validateLoanData(loanData) {
    if (!loanData.downPayment.percentage || !loanData.tenor || !loanData.insurance) {
        showNotification('Mohon lengkapi semua data pinjaman', 'error');
        return false;
    }
    
    const dpPercentage = parseFloat(loanData.downPayment.percentage);
    if (dpPercentage > 100) {
        showNotification('Maksimum DP adalah 100%', 'error');
        return false;
    }
    
    return true;
}

// Rest of the JavaScript code remains the same