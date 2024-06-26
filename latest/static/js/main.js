const closebtn = document.getElementById('close');
const panelContent = document.getElementById('panelContent');
const menubtn = document.getElementById('menubtn');
closebtn.addEventListener('click', () => {
    panelContent.classList.add('hidden');
})
menubtn.addEventListener('click', () => {
    console.log("clicked")
    panelContent.classList.remove('hidden')
    panelContent.classList.add('block');
})
