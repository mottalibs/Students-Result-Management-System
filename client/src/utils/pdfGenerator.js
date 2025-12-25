import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateTranscript = (student, result) => {
    const doc = new jsPDF();
    
    // Colors
    const PRIMARY_COLOR = [37, 99, 235]; // Blue-600
    const TEXT_COLOR = [30, 41, 59]; // Slate-800
    const LIGHT_GRAY = [241, 245, 249]; // Slate-100

    // --- Background Watermark ---
    doc.setTextColor(245, 247, 250);
    doc.setFontSize(60);
    doc.setFont('helvetica', 'bold');
    doc.text('RESULT PORTAL', 105, 150, { align: 'center', angle: 45 });
    doc.text('UNIVERSITY', 105, 180, { align: 'center', angle: 45 });

    // --- Header ---
    // University Name
    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('ResultPortal University', 105, 25, { align: 'center' });

    // Address/Subtitle
    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Excellence in Education • Est. 2024', 105, 32, { align: 'center' });
    doc.text('Dhaka, Bangladesh • www.resultportal.com', 105, 37, { align: 'center' });

    // Divider
    doc.setDrawColor(...PRIMARY_COLOR);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    // Title
    doc.setTextColor(0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL ACADEMIC TRANSCRIPT', 105, 58, { align: 'center' });

    // --- Student Info Box ---
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(20, 65, 170, 35, 3, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(...TEXT_COLOR);
    
    const leftX = 25;
    const rightX = 110;
    let y = 75;

    // Row 1
    doc.setFont('helvetica', 'bold');
    doc.text('Student Name:', leftX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(student.name?.toUpperCase() || 'N/A', leftX + 30, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Roll Number:', rightX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(student.roll || 'N/A', rightX + 30, y);

    y += 8;
    // Row 2
    doc.setFont('helvetica', 'bold');
    doc.text('Department:', leftX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(student.department || 'N/A', leftX + 30, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Registration:', rightX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(student.registrationNo || 'N/A', rightX + 30, y);

    y += 8;
    // Row 3
    doc.setFont('helvetica', 'bold');
    doc.text('Semester:', leftX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(result.semester || 'N/A', leftX + 30, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Session:', rightX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(student.session || '2023-2024', rightX + 30, y);

    // --- Result Table ---
    const tableColumn = ["Subject Code", "Subject Name", "Marks", "Grade", "Point"];
    const tableRows = result.subjects.map((sub, index) => [
        `SUB-${100 + index}`, // Mock code
        sub.subjectName,
        sub.marks,
        sub.grade,
        sub.point || '-'
    ]);

    doc.autoTable({
        startY: 110,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { 
            fillColor: PRIMARY_COLOR, 
            textColor: 255, 
            fontStyle: 'bold',
            halign: 'center'
        },
        styles: { 
            fontSize: 10, 
            cellPadding: 4,
            textColor: TEXT_COLOR
        },
        columnStyles: {
            0: { cellWidth: 30, halign: 'center' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
            4: { cellWidth: 20, halign: 'center' }
        },
        alternateRowStyles: {
            fillColor: [250, 250, 255]
        }
    });

    // --- Summary Section ---
    const finalY = doc.lastAutoTable.finalY + 10;
    
    // CGPA Box
    doc.setDrawColor(...PRIMARY_COLOR);
    doc.setLineWidth(0.5);
    doc.rect(130, finalY, 60, 25);
    
    doc.setFillColor(...LIGHT_GRAY);
    doc.rect(130, finalY, 60, 8, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PRIMARY_COLOR);
    doc.text('RESULT SUMMARY', 160, finalY + 6, { align: 'center' });
    
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text(`CGPA: ${result.cgpa?.toFixed(2)}`, 140, finalY + 16);
    doc.text(`Status: ${result.status}`, 140, finalY + 22);

    // --- Footer / Signatures ---
    const footerY = 250;
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    
    // Controller Signature
    doc.line(130, footerY, 180, footerY);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Controller of Examinations', 155, footerY + 5, { align: 'center' });
    
    // Verification Note
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100);
    doc.text('This transcript is computer generated and contains a digital verification code.', 105, 275, { align: 'center' });
    
    // QR Code Placeholder
    doc.setDrawColor(200);
    doc.rect(20, 240, 25, 25);
    doc.setFontSize(8);
    doc.text('Scan to Verify', 32.5, 270, { align: 'center' });

    // Save
    doc.save(`Transcript_${student.roll}_${result.semester}.pdf`);
};
