package com.voting.service.nominy;

import com.voting.entity.nominy.Nominator;
import com.voting.repository.nominator_repo.NominatorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class NominatorService {

    private final NominatorRepository nominatorRepository;
    private final S3Service s3Service;

    @Autowired
    public NominatorService(NominatorRepository nominatorRepository, S3Service s3Service) {
        this.nominatorRepository = nominatorRepository;
        this.s3Service = s3Service;
    }

    public Nominator saveNominator(String name, Integer age, String email, Integer aadharNumber, MultipartFile photo, MultipartFile nativityCertificate) throws IOException {
        // Upload the photo and nativity certificate to S3
        String photoImageKey = s3Service.uploadFile(photo);
        String nativityImageKey = s3Service.uploadFile(nativityCertificate);

        // Create the Nominator entity and save to the database with payment status "PENDING"
        Nominator nominator = Nominator.builder()
                .name(name)
                .age(age)
                .email(email)
                .aadharNumber(aadharNumber)
                .photoImagePath(photoImageKey)
                .nativityImagePath(nativityImageKey)
                .paymentStatus("PENDING") // Set payment status to "PENDING"
                .build();

        return nominatorRepository.save(nominator);
    }


    public Nominator findNominatorById(Integer id) {
        return nominatorRepository.findById(id).orElse(null);
    }

    public List<Nominator> findAllNominators() {
        return nominatorRepository.findAll();
    }

    public void updatePaymentStatus(Integer nominatorId, String status) {
        Nominator nominator = findNominatorById(nominatorId);
        if (nominator != null) {
            nominator.setPaymentStatus(status);
            nominatorRepository.save(nominator);
        }
    }


}
