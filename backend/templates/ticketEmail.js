const ticketEmail = ({
  customerName,
  bookingId,
  movie,
  theater,
  showtime,
  date,
  seats,
  totalPrice,
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Velora Cinema Ticket</title>
</head>

<body style="margin:0;padding:0;background:#0B0F19;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px;">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#151A26;border-radius:20px;overflow:hidden;">

<!-- Header -->
<tr>
<td style="background:#FACC15;padding:25px;text-align:center;">
<h1 style="margin:0;color:#000;">🎬 Velora Cinema</h1>
<p style="margin-top:8px;color:#000;font-weight:bold;">
Luxury IMAX Experience
</p>
</td>
</tr>

<!-- Content -->
<tr>
<td style="padding:35px;color:white;">

<h2 style="margin-top:0;">Hi ${customerName},</h2>

<p style="color:#C7CBD1;font-size:15px;line-height:1.6;">
Great news! Your booking has been successfully confirmed.
Your seats are now reserved and your payment has been received.
We can't wait to welcome you to <strong>Velora Cinema</strong> for an unforgettable movie experience.
</p>

<div style="background:#111827;border:1px solid #FACC15;border-radius:12px;padding:18px;margin:25px 0;">
  <p style="margin:0;color:#FACC15;font-size:18px;font-weight:bold;">
    Booking Confirmed ✅
  </p>
  <p style="margin:8px 0 0;color:#E5E7EB;font-size:14px;">
    Please arrive at least <strong>20 minutes before</strong> the show starts to avoid any last-minute delays.
  </p>
</div>

<hr style="border-color:#2A3245;">

<!-- Booking Details -->
<table width="100%" cellpadding="10">

<tr>
<td style="color:#9CA3AF;">Booking ID</td>
<td align="right" style="color:#FACC15;font-weight:bold;">
${bookingId}
</td>
</tr>

<tr>
<td style="color:#9CA3AF;">Movie</td>
<td align="right">${movie}</td>
</tr>

<tr>
<td style="color:#9CA3AF;">Theater</td>
<td align="right">${theater}</td>
</tr>

<tr>
<td style="color:#9CA3AF;">Date</td>
<td align="right">${date}</td>
</tr>

<tr>
<td style="color:#9CA3AF;">Showtime</td>
<td align="right">${showtime}</td>
</tr>

<tr>
<td style="color:#9CA3AF;">Seats</td>
<td align="right">${seats.join(", ")}</td>
</tr>

<tr>
<td style="color:#9CA3AF;">Amount Paid</td>
<td align="right" style="font-weight:bold;color:#FACC15;">
₹${totalPrice}
</td>
</tr>

</table>

<hr style="border-color:#2A3245;">

<!-- QR Section -->
<div style="text-align:center;margin:30px 0;">

<h3 style="color:#FACC15;margin-bottom:18px;">
Your Entry QR Code
</h3>

<img
src="cid:ticketQR"
alt="Velora QR Code"
width="170"
style="background:#fff;padding:14px;border-radius:14px;display:block;margin:0 auto;"
>

<p style="margin-top:18px;color:#C7CBD1;">
Show this QR code at the theater entrance for quick verification.
</p>

</div>

<hr style="border-color:#2A3245;">

<!-- Important Information -->
<h3 style="color:#FACC15;">Important Information</h3>

<ul style="color:#C7CBD1;line-height:1.8;padding-left:20px;">
<li>Please carry this email or your digital ticket while entering the theater.</li>
<li>Arrive at least <strong>20 minutes before</strong> your showtime.</li>
<li>Seats are reserved exclusively for this booking.</li>
<li>Keep your Booking ID <strong>${bookingId}</strong> handy if you need assistance.</li>
</ul>

<div style="background:#111827;border-radius:12px;padding:18px;margin-top:25px;">
<p style="margin:0;color:#FACC15;font-weight:bold;">Need Help?</p>

<p style="margin-top:10px;color:#C7CBD1;font-size:14px;">
If you face any issues regarding your booking, our support team is here to help.
</p>

<p style="margin:6px 0;color:#C7CBD1;font-size:14px;">
📧 support@veloracinema.com
</p>

<p style="margin:6px 0;color:#C7CBD1;font-size:14px;">
📞 +91 98765 43210
</p>
</div>

<!-- Footer -->
<div style="text-align:center;margin-top:35px;">
<p style="font-size:13px;color:#6B7280;">
Thank you for choosing <strong>Velora Cinema</strong>.
</p>

<p style="font-size:12px;color:#4B5563;">
Experience movies the way they're meant to be watched.
</p>
</div>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};

export default ticketEmail;