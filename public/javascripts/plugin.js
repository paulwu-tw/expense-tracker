const panel = document.querySelector('#record-panel')

panel.addEventListener('click', (e) => {
  const target = e.target
  const id = target.dataset.id
  // console.log('ID: ', id)
  if (target.matches('.delete-record')) {
    if (window.confirm('Do you want to DELETE Record?')) {
      fetch(`/records/${id}?_method=DELETE`, { method: 'POST' })
        .then(() => window.location.reload())
        .catch(err => console.log(err))
    }
  }
})


