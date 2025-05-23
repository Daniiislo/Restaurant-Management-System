from django.shortcuts import render
from .models import *
from .serializers import *
from .permissions import *
from .authentications import *
from rest_framework import generics, permissions, authentication
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import random
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.settings import api_settings
import jwt
from django.core.mail import EmailMessage
from Booking.permissions import IsEmployeeOrAdmin
from phonenumbers import NumberParseException
from phonenumber_field.phonenumber import PhoneNumber
import json
import os
from django.conf import settings

# Create your views here.

def generate_otp(length=6):
    """Generate a random OTP of specified length."""
    digits = "0123456789"
    otp = ''.join(random.choice(digits) for _ in range(length))
    return otp

class CheckAccountExistsAPIView(generics.CreateAPIView):
    permission_classes = [IsEmployeeOrAdmin]
    queryset = CustomerAccount.objects.all()

    def post(self, request, *args, **kwargs):
        phone_number = request.data.get('phone_number')
        if not phone_number:
            return Response({'status': 'error','phone_number': 'Phone number is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            #cast phone_number to PhoneNumber type
            phone_number = PhoneNumber.from_string(phone_number, region= 'VN')
            if not phone_number.is_valid():
                return Response({'status': 'invalid', 'phone_number': 'Invalid phone number'}, status=status.HTTP_400_BAD_REQUEST)
            
            #check if phone number exists
            if CustomerAccount.objects.filter(phone_number=phone_number).exists():
                response = {
                    'status': 'exists',
                    'message': 'Phone number exists'
                }
                return Response(response, status=status.HTTP_200_OK)
            response = {
                'status': 'not_exists',
                'message': 'Phone number does not exist'
            }
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

        except NumberParseException:
            return Response({'phone_number': 'Invalid phone number'}, status=status.HTTP_400_BAD_REQUEST)


class AccountCheckAPIView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = AccountSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            response = {
                'status': 'success',
                'message': 'Account is available'
            }
            return Response(response, status=status.HTTP_200_OK)
        #response the account is not available
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AccountListCreateAPIView(generics.ListCreateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    def get_authenticators(self):
        if self.request.method == 'POST':
            return [CustomTokenAuthentication()]
        return super().get_authenticators()

    def post(self, request, *args, **kwargs):
        #create account
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            account = serializer.save()

            response = {
                'data': serializer.data,
                'status': 'success',
                'message': 'User created successfully'
            }
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AccountRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    lookup_field = 'pk'
    permission_classes = [IsOwnerOrAdmin]


    def get(self, request, *args, **kwargs):
        account = self.get_object()
        serializer = self.serializer_class(account)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        return Response({"detail": "Method 'PUT' not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        if 'id' in request.data.keys():
            return Response({'id': 'You cannot update id field'}, status=status.HTTP_400_BAD_REQUEST)
        if 'username' in request.data.keys():
            return Response({'username': 'You cannot update username field'}, status=status.HTTP_400_BAD_REQUEST)
        if 'account_type' in request.data.keys():
            return Response({'account_type': 'You cannot update account_type field'}, status=status.HTTP_400_BAD_REQUEST)
    
        account = self.get_object()
        serializer = self.serializer_class(account, data=request.data, partial=True)

        if serializer.is_valid(raise_exception=True):

            for key, value in request.data.items():
                if key == 'password':
                    account.set_password(value)
                else:
                    setattr(account, key, value)
                    
            account.save()

            response = {
                'data': serializer.data,
                'status': 'success',
                'message': 'User updated successfully'
            }
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
    def delete(self, request, *args, **kwargs):
        account = self.get_object()
        try:
            account.delete()
        except IntegrityError:
            return Response({'message': 'Cannot delete this account due to integrity constraints'}, status=status.HTTP_400_BAD_REQUEST)

        response = {
            'status': 'success',
            'message': 'User deleted successfully'
        }
        return Response(response, status=status.HTTP_200_OK)

class EmployeeAccountListCreateAPIView(generics.ListCreateAPIView):
    queryset = EmployeeAccount.objects.all()
    serializer_class = EmployeeAccountSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    def get_authenticators(self):
        if self.request.method == 'POST':
            return [CustomTokenAuthentication()]
        return super().get_authenticators()
        
    
class EmployeeAccountRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = EmployeeAccount.objects.all()
    serializer_class = EmployeeAccountSerializer
    lookup_field = 'account_id'
    permission_classes = [IsOwnerOrAdmin]

    def get(self, request, *args, **kwargs):
        employee = self.get_object()
        serializer = self.serializer_class(employee)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        return Response({"detail": "Method 'PUT' not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        if 'account_id' in request.data.keys():
            return Response({'account_id': 'You cannot update account_id field'}, status=status.HTTP_400_BAD_REQUEST)
        
        employee = self.get_object()
        serializer = self.serializer_class(employee, data=request.data, partial=True)

        if serializer.is_valid(raise_exception=True):
            for key, value in request.data.items():
                if key == 'department':
                    department = Department.objects.get(pk=value)
                    setattr(employee, key, department)  
                else:
                    setattr(employee, key, value)
            employee.save()

            response = {
                'data': serializer.data,
                'status': 'success',
                'message': 'Employee updated successfully'
            }
            return Response(response, status=status.HTTP_200_OK)

class CustomerAccountListCreateAPIView(generics.ListCreateAPIView):
    queryset = CustomerAccount.objects.all()
    serializer_class = CustomerAccountSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    def get_authenticators(self):
        if self.request.method == 'POST':
            return [CustomTokenAuthentication()]
        return super().get_authenticators()
    
class CustomerAccountRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = CustomerAccount.objects.all()
    serializer_class = CustomerAccountSerializer
    lookup_field = 'account_id'
    permission_classes = [IsOwner]

    def get(self, request, *args, **kwargs):
        employee = self.get_object()
        serializer = self.serializer_class(employee)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        return Response({"detail": "Method 'PUT' not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        if 'account_id' in request.data.keys():
            return Response({'account_id': 'You cannot update account_id field'}, status=status.HTTP_400_BAD_REQUEST)
        
        employee = self.get_object()
        serializer = self.serializer_class(employee, data=request.data, partial=True)

        if serializer.is_valid(raise_exception=True):
            for key, value in request.data.items():
                setattr(employee, key, value)
            employee.save()

            response = {
                'data': serializer.data,
                'status': 'success',
                'message': 'Employee updated successfully'
            }
            return Response(response, status=status.HTTP_200_OK)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class AccountLogoutAPIView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh')
        
        # check if refresh token is provided
        if not refresh_token:
            return Response({'message': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # blacklist refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()

            response = {
                'status': 'success',
                'message': 'User logged out successfully'
            }
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)
        
def gernerate_otp_and_send_email(email):
    #generate OTP
    otp = generate_otp()
    if OTP.objects.filter(email=email, revoked=False).exists():
        #revoke all previous OTPs
        OTP.objects.filter(email=email, revoked=False).update(revoked=True)
        
    OTP.objects.create(email=email, otp=otp, expired_at=timezone.now() + timezone.timedelta(minutes=5))

    _file_path = os.path.join(settings.BASE_DIR, 'Config', 'restaurant_configs.json')
    #get config
    with open(_file_path, encoding='utf-8') as f:
        config = json.load(f)

    # HTML email content
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác minh tài khoản</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h2 style="text-align: center; color: #333;">Xác minh tài khoản của bạn</h2>
            <p style="color: #333;">Chào bạn,</p>
            <p style="color: #333;">Cảm ơn bạn đã đăng ký tài khoản tại <strong>{config['name']}</strong>! Để hoàn tất quá trình đăng ký và kích hoạt tài khoản của bạn, vui lòng sử dụng mã OTP dưới đây để xác minh:</p>
            <div style="text-align: center; margin: 20px 0;">
                <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #ffffff; background-color: #0f6461; padding: 10px 20px; border-radius: 5px;">{otp}</span>
            </div>
            <p style="color: #333;">Mã OTP này sẽ hết hạn sau <strong>5 phút</strong>. Nếu bạn không yêu cầu mã OTP này, vui lòng bỏ qua email này hoặc liên hệ ngay với chúng tôi qua <a href=`mailto:{config['email']}` style="color: #0f6461;">{config['email']}</a> hoặc gọi tới số <strong>{config['phone']}</strong></strong>.</p>
            <p style="color: #333;">Chúng tôi rất mong được phục vụ bạn tại <strong>{config['name']}</strong>!</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="text-align: center; font-size: 14px; color: #aaa;">
                Đội ngũ <strong>{config['name']}</strong><br>
                {config['address']}<br>
                <strong>{config['phone']}</strong><br>
                <a href="mailto:{config['email']}" style="color: #0f6461;">{config['email']}</a>
            </p>
        </div>
    </body>
    </html>
    """

    # Sending the email with HTML content
    email_message = EmailMessage(
        subject='Xác minh tài khoản của bạn',
        body=html_content,
        from_email=settings.EMAIL_HOST_USER,
        to=[email],
    )
    email_message.content_subtype = "html"  # Specify email as HTML content
    email_message.send(fail_silently=False)
    return True

class ForgotPasswordAPIView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ForgotPasswordSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.validated_data.get('email')

            #generate OTP and send email
            gernerate_otp_and_send_email(email)

            response = {
                'status': 'success',
                'message': 'OTP sent successfully'
            }
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterOTPAPIView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterRequestOTPSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.validated_data.get('email')

            #generate OTP and send email
            gernerate_otp_and_send_email(email)

            response = {
                'status': 'success',
                'message': 'OTP sent successfully'
            }
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def generate_custom_token(email):
    # save original user id field and claim
    original_user_id_field = api_settings.USER_ID_FIELD
    original_user_id_claim = api_settings.USER_ID_CLAIM

    # override user id field and claim
    api_settings.USER_ID_FIELD = 'email'
    api_settings.USER_ID_CLAIM = 'email'

    try:
        token = RefreshToken()
        token['email'] = email
        access_token = str(token.access_token)
        refresh_token = str(token)
    except TokenError as e:
        raise exceptions.AuthenticationFailed('Invalid token')
    finally:
        # restore original user id field and claim
        api_settings.USER_ID_FIELD = original_user_id_field
        api_settings.USER_ID_CLAIM = original_user_id_claim
    return access_token, refresh_token
        
class VerifyOTPAPIView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = VerifyOTPSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.validated_data.get('email')

            # generate token
            access_token, refresh_token = generate_custom_token(email)

            # return access token and refresh token
            response = {
                'status': 'success',
                'message': 'OTP verified successfully',
                'access_token': access_token,
                'refresh_token': refresh_token,
            }
            return Response(response, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ResetPasswordAPIView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ResetPasswordSerializer
    authentication_classes = [CustomTokenAuthentication] # use custom token authentication

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            #get account and reset password
            account = Account.objects.get(email=serializer.validated_data.get('email'))
            account.set_password(serializer.validated_data.get('password'))
            account.save()
            
            response = {
                'status': 'success',
                'message': 'Password reset successfully'
            }
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CheckPasswordAPIView(generics.CreateAPIView):
    queryset = Account.objects.all()
    permission_classes = [IsOwner]

    def post(self, request, *args, **kwargs):
        id = request.data.get('id')
        password = request.data.get('password')
        if not id:
            return Response({'id': 'ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not password:
            return Response({'password': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            account = Account.objects.get(pk=id)
        except Account.DoesNotExist:
            return Response({'id': 'Account does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        
        self.check_object_permissions(request, account) #check if user is owner of the account

        if account.check_password(password):
            response = {
                'status': 'success',
                'message': 'Password is correct',
                'data': {
                    'id': account.id,
                }
            }
            return Response(response, status=status.HTTP_200_OK)
        return Response({'password': 'Incorrect password'}, status=status.HTTP_400_BAD_REQUEST)
    
class DepartmentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAdminUser]

class DepartmentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    lookup_field = 'pk'
    permission_classes = [permissions.IsAdminUser]

    def put(self, request, *args, **kwargs):
        return Response({"detail": "Method 'PUT' not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        if 'id' in request.data.keys():
            return Response({'id': 'You cannot update id field'}, status=status.HTTP_400_BAD_REQUEST)
        
        department = self.get_object()
        serializer = self.serializer_class(department, data=request.data, partial=True)

        if serializer.is_valid(raise_exception=True):
            for key, value in request.data.items():
                setattr(department, key, value)
            department.save()

            response = {
                'message': 'Department updated successfully',
                'status': 'success',
                'data': serializer.data
            }
            return Response(response, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        department = self.get_object()
        try:
            department.delete()
        except IntegrityError:
            return Response({'message': 'Cannot delete this department due to integrity constraints'}, status=status.HTTP_400_BAD_REQUEST)

        response = {
            'status': 'success',
            'message': 'Department deleted successfully'
        }
        return Response(response, status=status.HTTP_200_OK)