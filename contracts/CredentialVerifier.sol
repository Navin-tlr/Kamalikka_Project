// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CredentialVerifier {
    struct Certificate {
        address issuer;
        string studentName;
        string studentId;
        string courseName;
        string grade;
        uint256 issueDate;
        bool isRevoked;
        bytes32 certHash;
    }

    mapping(bytes32 => Certificate) public certificates;
    mapping(address => bool) public authorizedIssuers;

    event CertificateIssued(bytes32 indexed certHash, address indexed issuer, string studentId);
    event CertificateRevoked(bytes32 indexed certHash, address indexed revoker);
    event IssuerAuthorized(address indexed issuer);
    event IssuerDeauthorized(address indexed issuer);

    modifier onlyAuthorized() {
        require(authorizedIssuers[msg.sender], "Caller is not an authorized issuer");
        _;
    }

    constructor() {
        authorizedIssuers[msg.sender] = true; // Deployer is authorized by default
        emit IssuerAuthorized(msg.sender);
    }

    function authorizeIssuer(address _issuer) external onlyAuthorized {
        authorizedIssuers[_issuer] = true;
        emit IssuerAuthorized(_issuer);
    }

    function deauthorizeIssuer(address _issuer) external onlyAuthorized {
        authorizedIssuers[_issuer] = false;
        emit IssuerDeauthorized(_issuer);
    }

    function issueCertificate(
        string memory _studentName,
        string memory _studentId,
        string memory _courseName,
        string memory _grade
    ) external onlyAuthorized returns (bytes32) {
        // Create a unique hash for the certificate based on content and timestamp
        // In a real system, we might want deterministic hashing, but here we include block.timestamp to ensure uniqueness
        bytes32 certHash = keccak256(abi.encodePacked(msg.sender, _studentId, _courseName, _grade, block.timestamp));

        certificates[certHash] = Certificate({
            issuer: msg.sender,
            studentName: _studentName,
            studentId: _studentId,
            courseName: _courseName,
            grade: _grade,
            issueDate: block.timestamp,
            isRevoked: false,
            certHash: certHash
        });

        emit CertificateIssued(certHash, msg.sender, _studentId);
        return certHash;
    }

    function verifyCertificate(bytes32 _certHash) external view returns (bool isValid, Certificate memory metadata) {
        Certificate memory cert = certificates[_certHash];
        
        // Check if certificate exists (issuer should be non-zero)
        if (cert.issuer == address(0)) {
            return (false, cert);
        }

        // Check if revoked
        if (cert.isRevoked) {
            return (false, cert);
        }

        return (true, cert);
    }

    function revokeCertificate(bytes32 _certHash) external onlyAuthorized {
        require(certificates[_certHash].issuer != address(0), "Certificate does not exist");
        // Only the issuer can revoke (or we could allow any admin)
        // For now, let's say any authorized issuer can revoke, or strictly the original issuer?
        // Let's stick to: only the original issuer or the deployer? 
        // Simplest for POC: Any authorized issuer can revoke, or just check if msg.sender is the issuer.
        require(certificates[_certHash].issuer == msg.sender, "Only the issuer can revoke");

        certificates[_certHash].isRevoked = true;
        emit CertificateRevoked(_certHash, msg.sender);
    }
}
