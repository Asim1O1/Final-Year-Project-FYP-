// emailTemplates.js
export const emailTemplates = {
  registration: {
    subject: "🎉 Welcome to the MedConnect Familia, {{firstName}}!",
    body: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #4a6ee0; margin-bottom: 5px;">Welcome to Our Amazing Platform!</h1>
            <div style="height: 3px; background: linear-gradient(to right, #4a6ee0, #7eb6ff); width: 100px; margin: 0 auto;"></div>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">Dear <strong>{{fullName}}</strong>,</p>
          
          <p style="font-size: 16px; line-height: 1.5;">We're thrilled to welcome you to our platform! Your account has been successfully created, and you're now part of our growing community.</p>
          
          <div style="background-color: #f5f8ff; border-left: 4px solid #4a6ee0; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; font-size: 15px;">Here are some quick links to help you get started:</p>
            <ul style="margin-top: 10px; padding-left: 20px;">
              <li><a href="#" style="color: #4a6ee0; text-decoration: none;">Complete your profile</a></li>
              <li><a href="#" style="color: #4a6ee0; text-decoration: none;">Explore our features</a></li>
              <li><a href="#" style="color: #4a6ee0; text-decoration: none;">Connect with others</a></li>
            </ul>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">If you have any questions or need assistance, our support team is always ready to help!</p>
          
          <p style="font-size: 16px; line-height: 1.5; margin-top: 25px;">Warm regards,<br><strong style="color: #4a6ee0;">Team MedConnect</strong></p>
          
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #777; text-align: center;">
            <p>© 2025 Your Company Name. All rights reserved.</p>
            <p>
              <a href="#" style="color: #4a6ee0; text-decoration: none;">Privacy Policy</a> • 
              <a href="#" style="color: #4a6ee0; text-decoration: none;">Terms of Service</a> • 
              <a href="#" style="color: #4a6ee0; text-decoration: none;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `,
  },
  accountDeactivated: {
    subject: "⚠️ Your MedConnect Account Has Been Deactivated",
    body: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #e74c3c; margin-bottom: 5px;">Account Deactivated</h1>
          <div style="height: 3px; background: linear-gradient(to right, #e74c3c, #ff9b93); width: 100px; margin: 0 auto;"></div>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5;">Dear <strong>{{fullName}}</strong>,</p>
        
        <p style="font-size: 16px; line-height: 1.5;">We're writing to inform you that your MedConnect account has been deactivated by the system administrator. This action was taken in accordance with our platform policies.</p>
        
        <div style="background-color: #fff5f5; border-left: 4px solid #e74c3c; padding: 15px; margin: 25px 0;">
          <p style="margin: 0; font-size: 15px;"><strong>Important Information:</strong></p>
          <ul style="margin-top: 10px; padding-left: 20px;">
            <li>Your account access has been suspended</li>
            <li>Any scheduled appointments have been canceled</li>
            <li>Patients will no longer be able to book appointments with you</li>
          </ul>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5;">If you believe this action was taken in error or would like to discuss the reason for deactivation, please contact our administrative team directly at <a href="mailto:admin@medconnect.com" style="color: #e74c3c; text-decoration: none;">admin@medconnect.com</a>.</p>
        
        <p style="font-size: 16px; line-height: 1.5; margin-top: 25px;">Regards,<br><strong style="color: #e74c3c;">MedConnect Administration Team</strong></p>
        
        <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #777; text-align: center;">
          <p>© 2025 MedConnect. All rights reserved.</p>
          <p>
            <a href="#" style="color: #e74c3c; text-decoration: none;">Privacy Policy</a> • 
            <a href="#" style="color: #e74c3c; text-decoration: none;">Terms of Service</a> • 
            <a href="#" style="color: #e74c3c; text-decoration: none;">Contact Us</a>
          </p>
        </div>
      </div>
    `,
  },
  accountActivated: {
    subject: "🎉 Your MedConnect Account Has Been Activated",
    body: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #2ecc71; margin-bottom: 5px;">Account Activated</h1>
          <div style="height: 3px; background: linear-gradient(to right, #2ecc71, #a3e1c4); width: 100px; margin: 0 auto;"></div>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5;">Dear <strong>{{fullName}}</strong>,</p>
        
        <p style="font-size: 16px; line-height: 1.5;">We're excited to inform you that your MedConnect account has been successfully activated by the system administrator. You can now enjoy full access to all the services offered on our platform.</p>
        
        <div style="background-color: #eaf8f0; border-left: 4px solid #2ecc71; padding: 15px; margin: 25px 0;">
          <p style="margin: 0; font-size: 15px;"><strong>What You Can Do Now:</strong></p>
          <ul style="margin-top: 10px; padding-left: 20px;">
            <li>Schedule and manage appointments with patients</li>
            <li>Update your profile and contact information</li>
            <li>Access and manage your medical records</li>
          </ul>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5;">We are thrilled to have you back on board! If you need any assistance or have any questions, don't hesitate to reach out to us at <a href="mailto:support@medconnect.com" style="color: #2ecc71; text-decoration: none;">support@medconnect.com</a>.</p>
        
        <p style="font-size: 16px; line-height: 1.5; margin-top: 25px;">Best regards,<br><strong style="color: #2ecc71;">MedConnect Administration Team</strong></p>
        
        <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #777; text-align: center;">
          <p>© 2025 MedConnect. All rights reserved.</p>
          <p>
            <a href="#" style="color: #2ecc71; text-decoration: none;">Privacy Policy</a> • 
            <a href="#" style="color: #2ecc71; text-decoration: none;">Terms of Service</a> • 
            <a href="#" style="color: #2ecc71; text-decoration: none;">Contact Us</a>
          </p>
        </div>
      </div>
    `,
  },

  appointmentBooking: {
    subject: "📅 Your Appointment Request with Dr. {{doctorName}} - Next Steps",
    body: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #2e9e7a; margin-bottom: 5px;">Appointment Request Received</h1>
            <div style="height: 3px; background: linear-gradient(to right, #2e9e7a, #8cd9be); width: 100px; margin: 0 auto;"></div>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">Dear <strong>{{fullName}}</strong>,</p>
          
          <p style="font-size: 16px; line-height: 1.5;">We have received your appointment request with <strong>Dr. {{doctorName}}</strong> at {{hospitalName}}.</p>
          
          <div style="background-color: #f0f9f5; border: 1px solid #d0e9e0; border-radius: 5px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #2e9e7a; margin-top: 0;">Appointment Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; width: 40%; color: #666;">Date:</td>
                <td style="padding: 8px 0;"><strong>{{date}}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; width: 40%; color: #666;">Time:</td>
                <td style="padding: 8px 0;"><strong>{{startTime}}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; width: 40%; color: #666;">Doctor:</td>
                <td style="padding: 8px 0;"><strong>Dr. {{doctorName}}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; width: 40%; color: #666;">Location:</td>
                <td style="padding: 8px 0;"><strong>{{hospitalName}}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; width: 40%; color: #666;">Status:</td>
                <td style="padding: 8px 0;"><span style="background-color: #fff7e6; color: #e6a317; font-size: 12px; padding: 3px 8px; border-radius: 3px; font-weight: bold;">PENDING CONFIRMATION</span></td>
              </tr>
            </table>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">You will receive an official confirmation email once your appointment is approved. Please arrive 15 minutes before your scheduled time.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #2e9e7a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Manage Your Appointment</a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">If you have any questions or need to reschedule, please contact us at <a href="mailto:support@yourcompany.com" style="color: #2e9e7a; text-decoration: none;">support@yourcompany.com</a> or call <strong>(123) 456-7890</strong>.</p>
          
          <p style="font-size: 16px; line-height: 1.5; margin-top: 25px;">Best regards,<br><strong style="color: #2e9e7a;">Patient Care Team at Your Company</strong></p>
          
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #777; text-align: center;">
            <p>© 2025 Your Company Name. All rights reserved.</p>
            <p>
              <a href="#" style="color: #2e9e7a; text-decoration: none;">Privacy Policy</a> • 
              <a href="#" style="color: #2e9e7a; text-decoration: none;">Terms of Service</a> • 
              <a href="#" style="color: #2e9e7a; text-decoration: none;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `,
  },
  appointmentCompleted: {
    subject: "Thank You for Your Visit with Dr. {{doctorName}}",
    body: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #2e9e7a; margin-bottom: 5px;">Appointment Completed</h1>
            <div style="height: 3px; background: linear-gradient(to right, #2e9e7a, #8cd9be); width: 100px; margin: 0 auto;"></div>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">Dear <strong>{{fullName}}</strong>,</p>
          
          <p style="font-size: 16px; line-height: 1.5;">Thank you for visiting <strong>Dr. {{doctorName}}</strong> at {{hospitalName}}. We hope your appointment went well and that you received the care you needed.</p>
          
          <div style="background-color: #f0f9f5; border: 1px solid #d0e9e0; border-radius: 5px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #2e9e7a; margin-top: 0;">Appointment Summary:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; width: 40%; color: #666;">Date:</td>
                <td style="padding: 8px 0;"><strong>{{date}}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; width: 40%; color: #666;">Time:</td>
                <td style="padding: 8px 0;"><strong>{{startTime}}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; width: 40%; color: #666;">Doctor:</td>
                <td style="padding: 8px 0;"><strong>Dr. {{doctorName}}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; width: 40%; color: #666;">Location:</td>
                <td style="padding: 8px 0;"><strong>{{hospitalName}}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; width: 40%; color: #666;">Status:</td>
                <td style="padding: 8px 0;"><span style="background-color: #e6f7ef; color: #2e9e7a; font-size: 12px; padding: 3px 8px; border-radius: 3px; font-weight: bold;">COMPLETED</span></td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #f5f5f5; border-radius: 5px; padding: 15px; margin: 25px 0;">
            <h3 style="color: #555; margin-top: 0;">Next Steps:</h3>
            <ul style="padding-left: 20px; color: #555;">
              <li style="margin-bottom: 8px;">Your after-visit summary has been uploaded to your patient portal</li>
              <li style="margin-bottom: 8px;">Any prescribed medications have been sent to your pharmacy</li>
              <li style="margin-bottom: 8px;">Schedule any follow-up appointments recommended by your doctor</li>
              <li style="margin-bottom: 0;">Complete the satisfaction survey below to help us improve our services</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #2e9e7a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">View Your Records</a>
            <a href="#" style="background-color: #f5f5f5; color: #666; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; margin-left: 10px;">Rate Your Experience</a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">If you have any questions about your visit or need further assistance, please contact us at <a href="mailto:support@yourcompany.com" style="color: #2e9e7a; text-decoration: none;">support@yourcompany.com</a> or call <strong>(123) 456-7890</strong>.</p>
          
          <p style="font-size: 16px; line-height: 1.5; margin-top: 25px;">Best regards,<br><strong style="color: #2e9e7a;">Patient Care Team at Your Company</strong></p>
          
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #777; text-align: center;">
            <p>© 2025 Your Company Name. All rights reserved.</p>
            <p>
              <a href="#" style="color: #2e9e7a; text-decoration: none;">Privacy Policy</a> • 
              <a href="#" style="color: #2e9e7a; text-decoration: none;">Terms of Service</a> • 
              <a href="#" style="color: #2e9e7a; text-decoration: none;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `,
  },

  appointmentCancelled: {
    subject: "❌ Your Appointment with Dr. {{doctorName}} Has Been Cancelled",
    body: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #e74c3c; margin-bottom: 5px;">Appointment Cancelled</h1>
            <div style="height: 3px; background: linear-gradient(to right, #e74c3c, #f5b7b1); width: 100px; margin: 0 auto;"></div>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">Dear <strong>{{fullName}}</strong>,</p>
          
          <p style="font-size: 16px; line-height: 1.5;">This email confirms that your appointment with <strong>Dr. {{doctorName}}</strong> at {{hospitalName}} has been cancelled.</p>
          
          <div style="background-color: #fdf3f2; border: 1px solid #f5d0cd; border-radius: 5px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #e74c3c; margin-top: 0;">Cancelled Appointment Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; width: 40%; color: #666;">Date:</td>
                <td style="padding: 8px 0;"><strong>{{date}}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; width: 40%; color: #666;">Time:</td>
                <td style="padding: 8px 0;"><strong>{{startTime}}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; width: 40%; color: #666;">Doctor:</td>
                <td style="padding: 8px 0;"><strong>Dr. {{doctorName}}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; width: 40%; color: #666;">Location:</td>
                <td style="padding: 8px 0;"><strong>{{hospitalName}}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; width: 40%; color: #666;">Status:</td>
                <td style="padding: 8px 0;"><span style="background-color: #fde9e7; color: #e74c3c; font-size: 12px; padding: 3px 8px; border-radius: 3px; font-weight: bold;">CANCELLED</span></td>
              </tr>
            </table>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">If you would like to reschedule your appointment, please use the button below or contact our office.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #2e9e7a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Schedule New Appointment</a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">If you have any questions or concerns, please contact us at <a href="mailto:support@yourcompany.com" style="color: #2e9e7a; text-decoration: none;">support@yourcompany.com</a> or call <strong>(123) 456-7890</strong>.</p>
          
          <p style="font-size: 16px; line-height: 1.5; margin-top: 25px;">Best regards,<br><strong style="color: #2e9e7a;">Patient Care Team at Your Company</strong></p>
          
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #777; text-align: center;">
            <p>© 2025 Your Company Name. All rights reserved.</p>
            <p>
              <a href="#" style="color: #2e9e7a; text-decoration: none;">Privacy Policy</a> • 
              <a href="#" style="color: #2e9e7a; text-decoration: none;">Terms of Service</a> • 
              <a href="#" style="color: #2e9e7a; text-decoration: none;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `,
  },
  appointmentConfirmed: {
    subject: "✅ Your Appointment with Dr. {{doctorName}} is Confirmed",
    body: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #2e9e7a; margin-bottom: 5px;">Appointment Confirmed</h1>
          <div style="height: 3px; background: linear-gradient(to right, #2e9e7a, #8cd9be); width: 100px; margin: 0 auto;"></div>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5;">Dear <strong>{{fullName}}</strong>,</p>
        
        <p style="font-size: 16px; line-height: 1.5;">Great news! Your appointment with <strong>Dr. {{doctorName}}</strong> at {{hospitalName}} has been confirmed.</p>
        
        <div style="background-color: #f0f9f5; border: 1px solid #d0e9e0; border-radius: 5px; padding: 20px; margin: 25px 0;">
          <h3 style="color: #2e9e7a; margin-top: 0;">Appointment Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; width: 40%; color: #666;">Date:</td>
              <td style="padding: 8px 0;"><strong>{{date}}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; width: 40%; color: #666;">Time:</td>
              <td style="padding: 8px 0;"><strong>{{startTime}}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; width: 40%; color: #666;">Doctor:</td>
              <td style="padding: 8px 0;"><strong>Dr. {{doctorName}}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; width: 40%; color: #666;">Location:</td>
              <td style="padding: 8px 0;"><strong>{{hospitalName}}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; width: 40%; color: #666;">Status:</td>
              <td style="padding: 8px 0;"><span style="background-color: #e6f7ef; color: #2e9e7a; font-size: 12px; padding: 3px 8px; border-radius: 3px; font-weight: bold;">CONFIRMED</span></td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #f5f5f5; border-radius: 5px; padding: 15px; margin: 25px 0;">
          <h3 style="color: #555; margin-top: 0;">Appointment Reminders:</h3>
          <ul style="padding-left: 20px; color: #555;">
            <li style="margin-bottom: 8px;">Please arrive 15 minutes before your scheduled time</li>
            <li style="margin-bottom: 8px;">Bring your insurance card and photo ID</li>
            <li style="margin-bottom: 8px;">List of current medications</li>
            <li style="margin-bottom: 0;">Any recent test results or medical records</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background-color: #2e9e7a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Add to Calendar</a>
          <a href="#" style="background-color: #f5f5f5; color: #666; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; margin-left: 10px;">Reschedule</a>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5;">If you need to cancel or reschedule, please contact us at least 24 hours in advance at <a href="mailto:support@yourcompany.com" style="color: #2e9e7a; text-decoration: none;">support@yourcompany.com</a> or call <strong>(123) 456-7890</strong>.</p>
        
        <p style="font-size: 16px; line-height: 1.5; margin-top: 25px;">Best regards,<br><strong style="color: #2e9e7a;">Patient Care Team at Your Company</strong></p>
        
        <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #777; text-align: center;">
          <p>© 2025 Your Company Name. All rights reserved.</p>
          <p>
            <a href="#" style="color: #2e9e7a; text-decoration: none;">Privacy Policy</a> • 
            <a href="#" style="color: #2e9e7a; text-decoration: none;">Terms of Service</a> • 
            <a href="#" style="color: #2e9e7a; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `,
  },

  campaignCreated: {
    subject: "🏥 Join Us: {{hospitalName}}'s New Campaign on {{campaignDate}}",
    body: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #e05b4a; margin-bottom: 5px;">New Healthcare Campaign</h1>
            <div style="height: 3px; background: linear-gradient(to right, #e05b4a, #f7a48b); width: 100px; margin: 0 auto;"></div>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">Dear <strong>{{fullName}}</strong>,</p>
          
          <p style="font-size: 16px; line-height: 1.5;">We're excited to announce a new healthcare campaign organized by <strong>{{hospitalName}}</strong>!</p>
          
          <div style="background: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('https://via.placeholder.com/600x200'); background-size: cover; border-radius: 8px; padding: 30px; margin: 25px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <h2 style="color: #e05b4a; text-align: center; margin-top: 0;">Event Details</h2>
            
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-top: 20px;">
              <div style="flex: 1; min-width: 200px; margin: 10px; text-align: center; padding: 15px; background-color: #fff; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <div style="font-size: 24px; color: #e05b4a; margin-bottom: 5px;">📅</div>
                <div style="color: #777; font-size: 14px;">Date</div>
                <div style="font-weight: bold; margin-top: 5px;">{{campaignDate}}</div>
              </div>
              
              <div style="flex: 1; min-width: 200px; margin: 10px; text-align: center; padding: 15px; background-color: #fff; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <div style="font-size: 24px; color: #e05b4a; margin-bottom: 5px;">📍</div>
                <div style="color: #777; font-size: 14px;">Location</div>
                <div style="font-weight: bold; margin-top: 5px;">{{location}}</div>
              </div>
            </div>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">Join us for this important healthcare initiative. Activities will include:</p>
          
          <ul style="padding-left: 20px; margin: 20px 0;">
            <li style="margin-bottom: 10px;">Free health screenings</li>
            <li style="margin-bottom: 10px;">Health education workshops</li>
            <li style="margin-bottom: 10px;">Q&A sessions with healthcare professionals</li>
            <li>Community support resources</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #e05b4a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">RSVP Now</a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">We look forward to seeing you there and making a positive impact together!</p>
          
          <p style="font-size: 16px; line-height: 1.5; margin-top: 25px;">Warm regards,<br><strong style="color: #e05b4a;">Community Health Team at Your Company</strong></p>
          
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #777; text-align: center;">
            <p>© 2025 Your Company Name. All rights reserved.</p>
            <p>
              <a href="#" style="color: #e05b4a; text-decoration: none;">Privacy Policy</a> • 
              <a href="#" style="color: #e05b4a; text-decoration: none;">Terms of Service</a> • 
              <a href="#" style="color: #e05b4a; text-decoration: none;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `,
  },
  testBooking: {
    subject: "Your Medical Test Booking Confirmation",
    body: `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .footer { margin-top: 20px; padding: 10px; text-align: center; font-size: 12px; color: #6c757d; }
              .highlight { background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h2>Medical Test Booking Confirmation</h2>
              </div>
              <div class="content">
                  <p>Dear {{fullName}},</p>
                  <p>Your medical test has been successfully booked. Here are the details:</p>
                  
                  <div class="highlight">
                      <p><strong>Test Name:</strong> {{testName}}</p>
                      <p><strong>Hospital:</strong> {{hospitalName}}</p>
                      <p><strong>Date:</strong> {{date}}</p>
                      <p><strong>Time:</strong> {{time}}</p>
                      <p><strong>Payment Method:</strong> {{paymentMethod}}</p>
                      {{#if tokenNumber}}
                      <p><strong>Token Number:</strong> <span style="font-weight: bold; color: #dc3545;">{{tokenNumber}}</span></p>
                      {{/if}}
                  </div>
                  
                  <p><strong>Important Instructions:</strong></p>
                  <ul>
                      {{#if tokenNumber}}
                      <li>Please arrive <strong>10 minutes early</strong> with this email or your token number</li>
                      <li>Present your token number at the billing counter to complete payment</li>
                      {{else}}
                      <li>You can proceed directly to the test center as you've already paid online</li>
                      {{/if}}
                      <li>Bring any required identification documents</li>
                      <li>Follow any pre-test instructions provided by your doctor</li>
                  </ul>
                  
                  <p>If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance.</p>
              </div>
              <div class="footer">
                  <p>Thank you for choosing our services.</p>
                  <p>© {{year}} Your Hospital Name. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `,
    text: `Dear {{fullName}},

Your medical test has been successfully booked. Here are the details:

Test Name: {{testName}}
Hospital: {{hospitalName}}
Date: {{date}}
Time: {{time}}
Payment Method: {{paymentMethod}}
{{#if tokenNumber}}Token Number: {{tokenNumber}}{{/if}}

Important Instructions:
{{#if tokenNumber}}
- Please arrive 10 minutes early with this email or your token number
- Present your token number at the billing counter to complete payment
{{else}}
- You can proceed directly to the test center as you've already paid online
{{/if}}
- Bring any required identification documents
- Follow any pre-test instructions provided by your doctor

If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance.

Thank you for choosing our services.
© {{year}} Your Hospital Name. All rights reserved.`,
  },
};
