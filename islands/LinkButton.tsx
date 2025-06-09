/**
 * Basic Link button
 * Allows to use buttons to navigate the browser.
 */
export const LinkButton = ({ caption, href }: { caption: string, href: string }) => {
    
    const handleNavigation = () => {
        // Ensure this code only runs in the browser environment
        if (typeof window !== 'undefined') {
          // deno-lint-ignore no-window
          window.location.href = href;
        } else {
          console.warn("window object not available for navigation during server-side render.");
        }
    };
    
    return (
        <button type="button"
            onClick={handleNavigation}
        >
            {caption}
        </button>
    );
  
  };