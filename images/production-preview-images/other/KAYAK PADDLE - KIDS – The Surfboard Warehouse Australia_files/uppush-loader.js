const uppushContainer = document.createElement('div')
uppushContainer.id = 'uppush-notification'
uppushContainer.textContent = '\u200B'
document.body.appendChild(uppushContainer)

const uppushScript = document.createElement('script')
uppushScript.src = `/apps/pushup-notification/uppush-notification.min.js?v=${window.uppushExtVer}`
uppushScript.type = 'module'
uppushScript.defer = true
uppushScript.async = true
document.body.appendChild(uppushScript)