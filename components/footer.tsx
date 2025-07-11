export default function Footer() {
  return (
    <footer className="text-center text-sm text-gray-500 py-4 border-t">
      © 2025 AmirMaster. All rights reserved.
      <br />
      The questions are based on materials from 
      {" "}
      <a
        href="https://www.nite.org.il"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-blue-600"
      >
        The National Institute for Testing and Evaluation (NITE)
      </a>
      .
    </footer>
  );
}
