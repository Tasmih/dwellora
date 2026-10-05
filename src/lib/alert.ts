import Swal from "sweetalert2";

// Theme classes shared by every alert ( only btn classes, theme colors)
const customClass = {
  popup: "rounded-2xl! border! border-border! bg-surface! p-6!",
  title: "text-brand! text-xl! font-semibold!",
  htmlContainer: "text-muted! text-sm!",
  confirmButton: "btn btn-primary mx-2",
  cancelButton: "btn btn-secondary mx-2",
};

// Returns true if admin confirms the delete
export async function confirmDelete(itemName: string) {
  const result = await Swal.fire({
    title: `Delete this ${itemName}?`,
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    buttonsStyling: false,
    customClass,
  });

  return result.isConfirmed;
}

export function showError(message: string) {
  return Swal.fire({
    title: "Failed",
    text: message,
    icon: "error",
    buttonsStyling: false,
    customClass,
  });
}

export function showSuccess(message: string) {
  return Swal.fire({
    title: "Done",
    text: message,
    icon: "success",
    timer: 1500,
    showConfirmButton: false,
    customClass,
  });
}