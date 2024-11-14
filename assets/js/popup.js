
const storage_type = sessionStorage;
const consent_property_name = 'consent_wholesale_paradyn';

const popup_show = () => !storage_type.getItem(consent_property_name);
const store_consent = () => !storage_type.setItem(consent_property_name, true);

window.onload = () => {
 const popup_consent = document.getElementById('popup_consent_wholesale'); 
 const accept_button = document.getElementById('consent_accept_wholesale'); 

 const accept_f = event => {
  store_consent(storage_type);
  popup_consent.classList.add('shidden');
document.getElementById("popup_consent_wholesale").style.display='none';
 };

 accept_button.addEventListener('click',accept_f);

 if(!popup_show()) {
document.getElementById("popup_consent_wholesale").style.display='none';
 }
};
