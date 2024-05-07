// This component defines a layout for authentication-related pages.
// It centers its children vertically and horizontally within the container.

const AuthLayout = ({
  children // ReactNode representing the content to be displayed within the layout
}: {
  children: React.ReactNode // children prop is expected to be of type ReactNode
}) => {
  return ( 
    <div className="h-full flex items-center justify-center"> {/* Container div */}
      {children} {/* Display children within the container */}
    </div>
   );
}
 
export default AuthLayout; // Export the AuthLayout component for use in other parts of the application.
