const modalHTML = `
<!-- Modal -->
<div
  class="modal fade modal-open"
  id="example-modal"
  tabindex="-1"
  aria-labelledby="example-modal-label"
  aria-hidden="true"
>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="example-modal-label">
          Pick A Name
        </h1>
        <button
          type="button"
          id="close-button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <p>Enter a name you like...</p>
        <input class="form-control" id="custom-name-box" />
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Close
        </button>
        <button
          type="button"
          id="submit-name-btn"
          class="btn btn-primary"
          onclick="getCustomName()"
          data-bs-dismiss="modal"
        >
          Save changes
        </button>
      </div>
    </div>
  </div>
</div>
`;

window.addEventListener("DOMContentLoaded", modalAddHTML());

function modalAddHTML() {
  document.getElementById("modal-example1").innerHTML = modalHTML;
}
