// Vendor Registration JavaScript

const vendorRegisterForm = document.getElementById('vendorRegisterForm');
if (vendorRegisterForm) {
  vendorRegisterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const businessName = document.getElementById('businessName').value;
    const gstNumber = document.getElementById('gstNumber').value;
    const panNumber = document.getElementById('panNumber').value;
    const businessDescription = document.getElementById('businessDescription').value;
    const businessAddress = document.getElementById('businessAddress').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const pincode = document.getElementById('pincode').value;
    const bankName = document.getElementById('bankName').value;
    const bankAccountNumber = document.getElementById('bankAccountNumber').value;
    const bankIfsc = document.getElementById('bankIfsc').value;

    try {
      // First register as a user with VENDOR role
      const registerResponse = await api.register({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password,
        role: 'VENDOR',
      });

      if (registerResponse.success) {
        // Now register as a vendor
        const vendorResponse = await api.registerVendor({
          user_id: registerResponse.user.id,
          business_name: businessName,
          gst_number: gstNumber,
          pan_number: panNumber,
          bank_name: bankName,
          bank_account_number: bankAccountNumber,
          bank_ifsc: bankIfsc,
          business_description,
          business_address: businessAddress,
          city,
          state,
          pincode,
        });

        if (vendorResponse.success) {
          showAlert('Vendor registration successful! Your application is pending approval from admin.', 'success');
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 3000);
        }
      }
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  });
}

// Show Alert Function
function showAlert(message, type) {
  const alertDiv = document.getElementById('alert');
  if (alertDiv) {
    alertDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
      alertDiv.innerHTML = '';
    }, 5000);
  }
}
