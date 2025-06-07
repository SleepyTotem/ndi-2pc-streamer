# Stream Toggle and Receiver Scripts

This project consists of two Python scripts used to stream data or signals between two PCs. One PC acts as the sender (PC1), while the other acts as the receiver (PC2).

---

## 🖥️ PC1 - Stream Sender

**Script:** `main.py`

### Instructions:
1. Ensure the folder includes the required `Application.Network.ScanConverter2.x64.exe` file that is bundled alongside `main.py`.
2. Run `main.py`.
3. Click the **"Toggle Stream"** button in the UI.
4. Make sure the status updates to **"Running"**.

Once running, the script begins broadcasting the stream.

---

## 🖥️ PC2 - Stream Receiver

**Script:** `receiver.py`

### Instructions:
1. Run `receiver.py`.
2. Wait for a connection or stream source from PC1.

The script will automatically detect and handle the incoming stream once PC1 starts sending.

---

## 📦 Requirements

Ensure both PCs have Python installed and any necessary dependencies. The `Application.Network.ScanConverter2.x64.exe` file is used for stream functionality, make sure it remains in the same directory as `main.py`.

Required packages are automatically installed.
